import { Router } from "express";
import bcrypt from "bcrypt";
import { signAccessToken, signRefreshToken } from "./auth.jwt";
import { requireAuth, AuthedRequest } from "../../middlewares/auth.middleware";
import {
  findUserByEmail,
  saveUserOtp,
  findUserByEmailAndOtp,
  clearUserOtp,
  saveUserResetCode,
  findUserByEmailAndResetCode,
  clearUserResetCode,
  updateUserPassword,
} from "./auth.service";
import { sendOtpEmail, sendResetPasswordEmail } from "./auth.mail";

export const authRoutes = Router();

// POST /api/auth/login
authRoutes.post("/login", async (req, res) => {
  const { email, password, portal } = req.body as {
    email?: string;
    password?: string;
    portal?: "admin" | "customer";
  };

  if (!email || !password || !portal) {
    return res.status(400).json({ message: "email, password and portal are required" });
  }

  const user = await findUserByEmail(email);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const isAdminRole = user.role === "ADMIN" || user.role === "SUPER_ADMIN";
  const isCustomerRole =
    user.role === "ENTERPRISE" ||
    user.role === "DEVELOPER" ||
    user.role === "RESELLER";

  if (portal === "admin" && !isAdminRole) {
    return res.status(403).json({ message: "This account must use the customer portal." });
  }

  if (portal === "customer" && !isCustomerRole) {
    return res.status(403).json({ message: "This account must use the admin portal." });
  }

  // STEP 1: Generate OTP
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

  // expires in 5 minutes
  const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

  // STEP 2: Save OTP to DB
  await saveUserOtp(user.id, otpCode, otpExpiresAt);

  // STEP 3: Send OTP via email
  try {
    await sendOtpEmail(email, otpCode);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }

  // STEP 4: Respond
  return res.json({
    message: "OTP sent to your email",
    user: {
      email: user.email,
      role: user.role,
    },
  });
});

// POST /api/auth/verify-otp
authRoutes.post("/verify-otp", async (req, res) => {
  const { email, otpCode } = req.body as { email?: string; otpCode?: string };

  if (!email || !otpCode) {
    return res.status(400).json({ message: "email and otpCode are required" });
  }

  const user = await findUserByEmailAndOtp(email, otpCode);
  if (!user) {
    return res.status(401).json({ message: "Invalid OTP" });
  }

  if (!user.otpExpiresAt) {
    return res.status(401).json({ message: "OTP not found or expired" });
  }

  const isExpired = new Date(user.otpExpiresAt).getTime() < Date.now();
  if (isExpired) {
    await clearUserOtp(user.id);
    return res.status(401).json({ message: "OTP expired" });
  }

  await clearUserOtp(user.id);

  const accessToken = signAccessToken({ sub: user.id, role: user.role });
  const refreshToken = signRefreshToken({ sub: user.id, role: user.role });

  return res.json({
    accessToken,
    refreshToken,
    user: { id: user.id, email: user.email, role: user.role },
  });
});

// POST /api/auth/forgot-password
authRoutes.post("/forgot-password", async (req, res) => {
  const { email } = req.body as { email?: string };

  if (!email) {
    return res.status(400).json({ message: "email is required" });
  }

  const user = await findUserByEmail(email);

  // Always return same message (security)
  const responseMessage = {
    message: "If that email exists, a reset code has been sent",
  };

  if (!user) {
    return res.json(responseMessage);
  }

  // Generate reset code (6 digits)
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

  // expires in 10 minutes
  const resetCodeExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

  // Save to DB
  await saveUserResetCode(user.id, resetCode, resetCodeExpiresAt);

  // Send email
  try {
    await sendResetPasswordEmail(email, resetCode);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }

  return res.json(responseMessage);
});

// POST /api/auth/reset-password
authRoutes.post("/reset-password", async (req, res) => {
  const { email, resetCode, newPassword } = req.body as {
    email?: string;
    resetCode?: string;
    newPassword?: string;
  };

  if (!email || !resetCode || !newPassword) {
    return res.status(400).json({
      message: "email, resetCode and newPassword are required",
    });
  }

  // Password validation: minimum 8 characters with combination
  const errors = [];
  
  if (newPassword.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  
  if (!/[A-Z]/.test(newPassword)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  
  if (!/[a-z]/.test(newPassword)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  
  if (!/\d/.test(newPassword)) {
    errors.push("Password must contain at least one number");
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword)) {
    errors.push("Password must contain at least one special character");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: errors.join(", "),
    });
  }

  const user = await findUserByEmailAndResetCode(email, resetCode);
  if (!user) {
    return res.status(401).json({ message: "Invalid reset code" });
  }

  if (!user.resetCodeExpiresAt) {
    return res.status(401).json({ message: "Reset code not found or expired" });
  }

  const isExpired = new Date(user.resetCodeExpiresAt).getTime() < Date.now();
  if (isExpired) {
    await clearUserResetCode(user.id);
    return res.status(401).json({ message: "Reset code expired" });
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await updateUserPassword(user.id, passwordHash);
  await clearUserResetCode(user.id);

  return res.json({ message: "Password reset successful" });
});

// GET /api/auth/me
authRoutes.get("/me", requireAuth, (req: AuthedRequest, res) => {
  return res.json({ user: req.user });
});