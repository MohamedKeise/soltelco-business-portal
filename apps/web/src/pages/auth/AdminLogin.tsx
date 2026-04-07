import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setPortalEmail, setPortalRole, setPortalToken, clearPortalAuth } from "../../auth/portalToken";
import { postJson } from "../../api/httpClient";
import AuthAlert from "../../components/auth/AuthAlert";
import AdminAuthLayout from "../../components/auth/AdminAuthLayout";
import { validatePassword, type PasswordValidationResult, getPasswordRequirements } from "../../utils/passwordValidation";
import { getAuthErrorMessage } from "../../utils/getAuthErrorMessage";

type ApiRole =
  | "ENTERPRISE"
  | "DEVELOPER"
  | "RESELLER"
  | "ADMIN"
  | "SUPER_ADMIN";

type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    role: ApiRole;
  };
};

type LoginOtpStartResponse = {
  message: string;
  user: {
    email: string;
    role: ApiRole;
  };
};

type MessageResponse = {
  message: string;
};

export default function AdminLogin() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [errorTitle, setErrorTitle] = useState("");
  const [step, setStep] = useState<
    "credentials" | "otp" | "forgot-password" | "reset-password"
  >("credentials");
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [resetCode, setResetCode] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [info, setInfo] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidationResult>({
    isValid: false,
    errors: []
  });

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const nextOtp = [...otpCode];
    nextOtp[index] = value.replace(/\D/g, "");
    setOtpCode(nextOtp);
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    const nextOtp = ["", "", "", "", "", ""];

    pasted.split("").forEach((digit, index) => {
      nextOtp[index] = digit;
    });

    setOtpCode(nextOtp);
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpCode[index] && index > 0) {
      const prev = document.getElementById(`admin-otp-${index - 1}`) as HTMLInputElement | null;
      prev?.focus();
    }
  };

  const getOtpString = () => otpCode.join("");

  const handleResetCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const nextResetCode = [...resetCode];
    nextResetCode[index] = value.replace(/\D/g, "");
    setResetCode(nextResetCode);
  };

  const handleResetCodePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    const nextResetCode = ["", "", "", "", "", ""];

    pasted.split("").forEach((digit, index) => {
      nextResetCode[index] = digit;
    });

    setResetCode(nextResetCode);
  };

  const handleResetCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !resetCode[index] && index > 0) {
      const prev = document.getElementById(`reset-code-${index - 1}`) as HTMLInputElement | null;
      prev?.focus();
    }
  };

  const getResetCodeString = () => resetCode.join("");

  // Handle password change with validation
  const handlePasswordChange = (password: string) => {
    setNewPassword(password);
    setPasswordValidation(validatePassword(password));
  };

  useEffect(() => {
    if (step === "reset-password") {
      const first = document.getElementById("reset-code-0") as HTMLInputElement | null;
      first?.focus();
    }
  }, [step]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setErrorTitle("");
    setInfo("");
    setIsSigningIn(true);

    try {
      const data = await postJson<LoginOtpStartResponse>("/api/auth/login", {
        email,
        password,
        portal: "admin",
      });

      if (data.user.role !== "ADMIN" && data.user.role !== "SUPER_ADMIN") {
        clearPortalAuth("admin");
        setError("This account must use the customer portal.");
        setErrorTitle("Access Denied");
        return;
      }

      setStep("otp");
    } catch (err) {
      clearPortalAuth("admin");
      const errorMessage = getAuthErrorMessage(err, "Login failed");
      setError(errorMessage);
      
      // Set title based on mapped message
      if (errorMessage.includes("Please enter your email and password")) {
        setErrorTitle("Validation error");
      } else if (errorMessage.includes("internet connection")) {
        setErrorTitle("No internet connection");
      } else if (errorMessage.includes("verification code")) {
        setErrorTitle("Email service error");
      } else {
        setErrorTitle("Authentication error");
      }
    } finally {
      setIsSigningIn(false);
    }
  }

  async function onVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setErrorTitle("");
    setInfo("");
    setIsVerifyingOtp(true);

    if (!getOtpString()) {
      setError("Please enter the OTP code");
      setErrorTitle("Validation error");
      setIsVerifyingOtp(false);
      return;
    }

    try {
      const data = await postJson<LoginResponse>("/api/auth/verify-otp", {
        email,
        otpCode: getOtpString(),
      });

      // Check if user role is allowed for admin portal
      if (data.user.role !== "ADMIN" && data.user.role !== "SUPER_ADMIN") {
        clearPortalAuth("admin");
        setError("This account cannot access this portal.");
        setErrorTitle("Access Denied");
        return;
      }

      setPortalToken("admin", data.accessToken);
      setPortalRole("admin", data.user.role);
      setPortalEmail("admin", data.user.email);
      nav("/admin");

    } catch (err) {
      clearPortalAuth("admin");
      const errorMessage = getAuthErrorMessage(err, "OTP verification failed");
      setError(errorMessage);
      
      // Set title based on mapped message
      if (errorMessage.includes("Please enter your email and password")) {
        setErrorTitle("Validation error");
      } else if (errorMessage.includes("internet connection")) {
        setErrorTitle("No internet connection");
      } else if (errorMessage.includes("verification code")) {
        setErrorTitle("Email service error");
      } else {
        setErrorTitle("Verification error");
      }
    } finally {
      setIsVerifyingOtp(false);
    }
  }

  async function handleResendOtp() {
    setError("");
    setErrorTitle("");
    setInfo("");
    setOtpCode(["", "", "", "", "", ""]);
    setIsResendingOtp(true);

    try {
      await postJson<LoginOtpStartResponse>("/api/auth/login", {
        email,
        password,
        portal: "admin",
      });

      setInfo("A new OTP has been sent to your email.");
    } catch (err) {
      const errorMessage = getAuthErrorMessage(err, "Failed to resend OTP");
      setError(errorMessage);
      
      // Set title based on mapped message
      if (errorMessage.includes("Please enter your email and password")) {
        setErrorTitle("Validation error");
      } else if (errorMessage.includes("internet connection")) {
        setErrorTitle("No internet connection");
      } else if (errorMessage.includes("verification code")) {
        setErrorTitle("Email service error");
      } else {
        setErrorTitle("Resend error");
      }
    } finally {
      setIsResendingOtp(false);
    }
  }

  async function onForgotPasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setErrorTitle("");
    setInfo("");
    setIsSendingReset(true);

    if (!email) {
      setError("Please enter your email");
      setErrorTitle("Validation error");
      setIsSendingReset(false);
      return;
    }

    try {
      const data = await postJson<MessageResponse>("/api/auth/forgot-password", {
        email,
      });

      setInfo(data.message);
      setResetCode(["", "", "", "", "", ""]);
      setStep("reset-password");
    } catch (err) {
      const errorMessage = getAuthErrorMessage(err, "Failed to send reset code");
      setError(errorMessage);
      
      // Set title based on mapped message
      if (errorMessage.includes("Please enter your email and password")) {
        setErrorTitle("Validation error");
      } else if (errorMessage.includes("internet connection")) {
        setErrorTitle("No internet connection");
      } else if (errorMessage.includes("verification code")) {
        setErrorTitle("Email service error");
      } else {
        setErrorTitle("Reset request error");
      }
    } finally {
      setIsSendingReset(false);
    }
  }

  async function onResetPasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setErrorTitle("");
    setInfo("");
    setIsResettingPassword(true);

    if (!email || !getResetCodeString() || !newPassword) {
      setError("Please fill in all fields");
      setErrorTitle("Validation error");
      setIsResettingPassword(false);
      return;
    }

    if (!passwordValidation.isValid) {
      setError(passwordValidation.errors.join(", "));
      setErrorTitle("Password requirements");
      setIsResettingPassword(false);
      return;
    }

    try {
      const data = await postJson<MessageResponse>("/api/auth/reset-password", {
        email,
        resetCode: getResetCodeString(),
        newPassword,
      });

      setInfo(data.message);
      setNewPassword("");
      setPassword("");
      setStep("credentials");
    } catch (err) {
      const errorMessage = getAuthErrorMessage(err, "Failed to reset password");
      setError(errorMessage);
      
      // Set title based on mapped message
      if (errorMessage.includes("Please enter your email and password")) {
        setErrorTitle("Validation error");
      } else if (errorMessage.includes("internet connection")) {
        setErrorTitle("No internet connection");
      } else if (errorMessage.includes("verification code")) {
        setErrorTitle("Email service error");
      } else {
        setErrorTitle("Password reset error");
      }
    } finally {
      setIsResettingPassword(false);
    }
  }

  return (
    <AdminAuthLayout>
      <div>
      {error ? <AuthAlert type="error" message={error} title={errorTitle} /> : null}
      {info ? <AuthAlert type="success" message={info} /> : null}

      {step === "credentials" && (
  <form onSubmit={onSubmit} className="space-y-6">
    <div className="text-center">
      <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
        Welcome back
      </h2>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 sm:text-base">
        Sign in to access to admin dashboard
      </p>
    </div>

    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
        Email
      </label>
      <div className="relative">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-slate-400 dark:text-slate-500">
          mail
        </span>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@company.com"
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-[#ba56d4] focus:bg-white focus:ring-2 focus:ring-[rgba(186,86,212,0.16)] dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-900 dark:focus:ring-[rgba(186,86,212,0.24)]"
        />
      </div>
    </div>

    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
        Password
      </label>
      <div className="relative">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-slate-400 dark:text-slate-500">
          lock
        </span>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          type={showPassword ? "text" : "password"}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-12 text-sm text-slate-900 outline-none transition focus:border-[#ba56d4] focus:bg-white focus:ring-2 focus:ring-[rgba(186,86,212,0.16)] dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-900 dark:focus:ring-[rgba(186,86,212,0.24)]"
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          <span className="material-symbols-outlined text-[20px]">
            {showPassword ? "visibility_off" : "visibility"}
          </span>
        </button>
      </div>
    </div>

    <div className="flex items-center justify-end text-sm">
      <button
        type="button"
        onClick={() => {
          setError("");
          setErrorTitle("");
          setInfo("");
          setStep("forgot-password");
        }}
        className="font-medium text-[#8f2cad] transition hover:underline"
      >
        Forgot password?
      </button>
    </div>

    <button
      type="submit"
      disabled={isSigningIn}
      className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#ba56d4] py-3.5 font-semibold text-white shadow-[0_12px_30px_rgba(186,86,212,0.28)] transition hover:translate-y-[-1px] hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span className="material-symbols-outlined text-[20px]">
        login
      </span>
      {isSigningIn ? "Signing in..." : "Sign in"}
    </button>
  </form>
)}

      {step === "forgot-password" && (
        <form onSubmit={onForgotPasswordSubmit} className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Forgot password?
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 sm:text-base">
              Enter your admin email and we'll send you a reset code
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Email
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-slate-400">
                mail
              </span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@company.com"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-[#ba56d4] focus:bg-white focus:ring-2 focus:ring-[rgba(186,86,212,0.16)] dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-900 dark:focus:ring-[rgba(186,86,212,0.24)]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSendingReset}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#ba56d4] py-3.5 font-semibold text-white shadow-[0_12px_30px_rgba(186,86,212,0.28)] transition hover:translate-y-[-1px] hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="material-symbols-outlined text-[20px]">
              mail
            </span>
            {isSendingReset ? "Sending..." : "Send reset code"}
          </button>

          <button
            type="button"
            onClick={() => {
              setError("");
              setErrorTitle("");
              setInfo("");
              setStep("credentials");
            }}
            className="w-full rounded-2xl border border-slate-200 bg-white py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Back to login
          </button>
        </form>
      )}

      {step === "reset-password" && (
        <form onSubmit={onResetPasswordSubmit} className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Reset password
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 sm:text-base">
              Enter the reset code and choose a new admin password
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Email
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-slate-400 dark:text-slate-500">
                mail
              </span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@company.com"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-[#ba56d4] focus:bg-white focus:ring-2 focus:ring-[rgba(186,86,212,0.16)] dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-900 dark:focus:ring-[rgba(186,86,212,0.24)]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Reset Code
            </label>

            <div
              className="flex justify-center gap-3 sm:gap-5"
              onPaste={handleResetCodePaste}
            >
              {resetCode.map((digit, index) => (
                <input
                  key={index}
                  id={`reset-code-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const value = e.target.value;
                    handleResetCodeChange(index, value);

                    if (value && index < 5) {
                      const next = document.getElementById(
                        `reset-code-${index + 1}` 
                      ) as HTMLInputElement | null;
                      next?.focus();
                    }
                  }}
                  onKeyDown={(e) => handleResetCodeKeyDown(index, e)}
                  className="h-14 w-10 rounded-2xl border border-slate-200 bg-slate-50 text-center text-lg font-semibold text-slate-900 outline-none transition focus:border-[#ba56d4] focus:bg-white focus:ring-2 focus:ring-[rgba(186,86,212,0.16)] dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-900 dark:focus:ring-[rgba(186,86,212,0.24)] sm:w-11"
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              New Password
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-slate-400 dark:text-slate-500">
                lock
              </span>
              <input
                value={newPassword}
                onChange={(e) => handlePasswordChange(e.target.value)}
                placeholder="Enter new password"
                type={showPassword ? "text" : "password"}
                className={`w-full rounded-2xl border bg-slate-50 py-3 pl-12 pr-12 text-sm text-slate-900 outline-none transition focus:bg-white focus:ring-2 focus:ring-[rgba(186,86,212,0.16)] dark:bg-slate-800 dark:text-white dark:focus:bg-slate-900 dark:focus:ring-[rgba(186,86,212,0.24)] ${
                  newPassword && !passwordValidation.isValid
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-100 dark:border-red-400 dark:focus:border-red-500 dark:focus:ring-red-900/20'
                    : 'border-slate-200 focus:border-[#ba56d4] dark:border-slate-700'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          {newPassword && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Password requirements:</p>
              <div className="space-y-1">
                {getPasswordRequirements().map((requirement, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    <span className={`material-symbols-outlined text-[14px] ${
                      passwordValidation.errors.some(error => error.includes(requirement.split(' ')[0].toLowerCase()))
                        ? 'text-red-500'
                        : 'text-green-500'
                    }`}>
                      {passwordValidation.errors.some(error => error.includes(requirement.split(' ')[0].toLowerCase()))
                        ? 'radio_button_unchecked'
                        : 'check_circle'
                      }
                    </span>
                    <span className={
                      passwordValidation.errors.some(error => error.includes(requirement.split(' ')[0].toLowerCase()))
                        ? 'text-red-600'
                        : 'text-green-600'
                    }>
                      {requirement}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isResettingPassword}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#ba56d4] py-3.5 font-semibold text-white shadow-[0_12px_30px_rgba(186,86,212,0.28)] transition hover:translate-y-[-1px] hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="material-symbols-outlined text-[20px]">
              lock_reset
            </span>
            {isResettingPassword ? "Resetting..." : "Reset password"}
          </button>

          <button
            type="button"
            onClick={() => {
              setError("");
              setErrorTitle("");
              setInfo("");
              setStep("credentials");
            }}
            className="w-full rounded-2xl border border-slate-200 bg-white py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Back to login
          </button>
        </form>
      )}

      {step === "otp" && (
        <form onSubmit={onVerifyOtp} className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Verify your identity
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 sm:text-base">
              Enter the 6-digit verification code sent to your admin email
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              OTP Code
            </label>

            <div
              className="flex justify-center gap-3 sm:gap-5"
              onPaste={handleOtpPaste}
            >
              {otpCode.map((digit, index) => (
                <input
                  key={index}
                  id={`admin-otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const value = e.target.value;
                    handleOtpChange(index, value);

                    if (value && index < 5) {
                      const next = document.getElementById(
                        `admin-otp-${index + 1}` 
                      ) as HTMLInputElement | null;
                      next?.focus();
                    }
                  }}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="h-14 w-10 rounded-2xl border border-slate-200 bg-slate-50 text-center text-lg font-semibold text-slate-900 outline-none transition focus:border-[#ba56d4] focus:bg-white focus:ring-2 focus:ring-[rgba(186,86,212,0.16)] dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-900 dark:focus:ring-[rgba(186,86,212,0.24)] sm:w-11"
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isVerifyingOtp}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#ba56d4] py-3.5 font-semibold text-white shadow-[0_12px_30px_rgba(186,86,212,0.28)] transition hover:translate-y-[-1px] hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="material-symbols-outlined text-[20px]">
              verified_user
            </span>
            {isVerifyingOtp ? "Verifying..." : "Verify OTP"}
          </button>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isResendingOtp}
              className="rounded-2xl border border-slate-200 bg-white py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              {isResendingOtp ? "Sending..." : "Resend OTP"}
            </button>

            <button
              type="button"
              onClick={() => {
                setError("");
                setInfo("");
                setOtpCode(["", "", "", "", "", ""]);
                setStep("credentials");
              }}
              className="rounded-2xl border border-slate-200 bg-white py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Back to login
            </button>
          </div>
        </form>
      )}
      </div>
    </AdminAuthLayout>
  );
}
