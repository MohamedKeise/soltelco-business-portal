import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setPortalEmail, setPortalRole, setPortalToken, clearPortalAuth } from "../../auth/portalToken";
import { postJson } from "../../api/httpClient";
import CustomerAuthLayout from "../../components/auth/CustomerAuthLayout";
import AuthAlert from "../../components/auth/AuthAlert";
import logo from "../../assets/marketing/logo.png";
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

type MessageResponse = {
  message: string;
};

type LoginOtpStartResponse = {
  message: string;
  user: {
    email: string;
    role: ApiRole;
  };
};

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [errorTitle, setErrorTitle] = useState("");
  const [step, setStep] = useState<
    "credentials" | "otp" | "forgot-password" | "reset-password"
  >("credentials");
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [info, setInfo] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidationResult>({
    isValid: false,
    errors: []
  });

  // Helper function to handle OTP input changes
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newOtpCode = [...otpCode];
    newOtpCode[index] = value;
    setOtpCode(newOtpCode);
  };

  // Helper function to handle paste event
  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const digits = pastedData.split("").filter(char => /\d/.test(char));
    
    const newOtpCode = ["", "", "", "", "", ""];
    digits.forEach((digit, index) => {
      if (index < 6) newOtpCode[index] = digit;
    });
    setOtpCode(newOtpCode);
  };

  // Helper function to handle key navigation
  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent,
    prefix: "otp" | "reset-otp" = "otp"
  ) => {
    if (e.key === "Backspace" && !otpCode[index] && index > 0) {
      const prevInput = document.getElementById(
        `${prefix}-${index - 1}` 
      ) as HTMLInputElement | null;

      prevInput?.focus();
    }
  };

  // Helper function to get combined OTP string
  const getOtpString = () => otpCode.join("");

  // Auto-focus first OTP box when entering reset-password step
  useEffect(() => {
    if (step === "reset-password") {
      const first = document.getElementById("reset-otp-0") as HTMLInputElement;
      first?.focus();
    }
  }, [step]);

  // Handle password change with validation
  const handlePasswordChange = (password: string) => {
    setNewPassword(password);
    setPasswordValidation(validatePassword(password));
  };

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
        portal: "customer",
      });

      if (data.user.role === "ADMIN" || data.user.role === "SUPER_ADMIN") {
        clearPortalAuth("customer");
        setError("This account must use the admin portal.");
        setErrorTitle("Access Denied");
        return;
      }

      setStep("otp");
    } catch (err) {
      clearPortalAuth("customer");
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

      // ❗ role check stays SAME as before
      if (data.user.role === "ADMIN" || data.user.role === "SUPER_ADMIN") {
        clearPortalAuth("customer");
        setError("This account cannot access this portal.");
        setErrorTitle("Access Denied");
        return;
      }

      setPortalToken("customer", data.accessToken);
      setPortalRole("customer", data.user.role);
      setPortalEmail("customer", data.user.email);
      nav("/app/dashboard");

    } catch (err) {
      clearPortalAuth("customer");
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
    setIsResendingOtp(true);

    try {
      await postJson<LoginOtpStartResponse>("/api/auth/login", {
        email,
        password,
        portal: "customer",
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
      setOtpCode(["", "", "", "", "", ""]);
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

    if (!email || !getOtpString() || !newPassword) {
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
        resetCode: getOtpString(),
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
    <CustomerAuthLayout>
      <div>
        {step === "credentials" && (
          <div className="space-y-8">
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 border border-primary/15 shadow-sm sm:h-14 sm:w-14">
                  <img src={logo} alt="Soltelco" className="h-16 w-16 object-contain sm:h-16 sm:w-16" />
                </div>

                <div>
                  <p className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">Soltelco</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Business Portal</p>
                </div>
              </div>

              <div className="pt-2">
                <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                  Welcome back
                </h1>
                <p className="mt-3 max-w-md text-lg leading-relaxed text-slate-500 dark:text-slate-400">
                  Manage your enterprise connectivity and digital services.
                </p>
              </div>
            </div>

            {error ? <AuthAlert type="error" message={error} title={errorTitle} /> : null}

            {info ? <AuthAlert type="success" message={info} /> : null}

            <form onSubmit={onSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Corporate Email
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-slate-400 dark:text-slate-500">
                    mail
                  </span>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@company.com"
                    className="h-14 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-slate-900 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-900 dark:focus:ring-primary/30"
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
                    className="h-14 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-12 text-slate-900 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-900 dark:focus:ring-primary/30"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-300"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setErrorTitle("");
                    setInfo("");
                    setStep("forgot-password");
                  }}
                  className="text-sm font-medium text-primary transition hover:opacity-80"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isSigningIn}
                className="h-14 w-full rounded-xl bg-primary text-base font-semibold text-white shadow-lg shadow-primary/25 transition hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
              >
                {isSigningIn ? "Signing in..." : "Sign in"}
              </button>

              <div className="pt-4">
                <p className="text-sm leading-relaxed text-slate-400 dark:text-slate-500">
                  Secured access for Soltelco Business Portal customers.
                </p>
              </div>
            </form>
          </div>
        )}

        {step === "otp" && (
          <div className="space-y-6 sm:space-y-8">
            <div className="space-y-4 sm:space-y-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 border border-primary/15 shadow-sm sm:h-14 sm:w-14">
                  <img src={logo} alt="Soltelco" className="h-16 w-16 object-contain sm:h-16 sm:w-16" />
                </div>

                <div>
                  <p className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">Soltelco</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Business Portal</p>
                </div>
              </div>

              <div className="pt-2">
                <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                  Verify your email
                </h1>
                <p className="mt-3 max-w-md text-base leading-relaxed text-slate-500 dark:text-slate-400 sm:text-lg">
                  Enter the 6-digit verification code sent to <span className="font-medium text-slate-700 dark:text-slate-300">{email}</span>.
                </p>
              </div>
            </div>

            {error ? <AuthAlert type="error" message={error} title={errorTitle} /> : null}

            {info ? <AuthAlert type="success" message={info} /> : null}

            <form onSubmit={onVerifyOtp} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  OTP Code
                </label>

                <div className="flex justify-between gap-2 sm:gap-3" onPaste={handleOtpPaste}>
                  {otpCode.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => {
                        const value = e.target.value;
                        handleOtpChange(index, value);
                        
                        // Auto-focus next input if digit is entered
                        if (value && index < 5) {
                          const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
                          if (nextInput) nextInput.focus();
                        }
                      }}
                      onKeyDown={(e) => handleOtpKeyDown(index, e, "otp")}
                      className="h-14 w-11 rounded-2xl border border-slate-200 bg-slate-50 text-center text-lg font-semibold text-slate-900 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-900 dark:focus:ring-primary/30 sm:h-14 sm:w-12"
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isVerifyingOtp}
                className="h-14 w-full rounded-xl bg-primary text-base font-semibold text-white shadow-lg shadow-primary/25 transition hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
              >
                {isVerifyingOtp ? "Verifying..." : "Verify OTP"}
              </button>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isResendingOtp}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  {isResendingOtp ? "Sending..." : "Resend OTP"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setErrorTitle("");
                    setInfo("");
                    setOtpCode(["", "", "", "", "", ""]);
                    setStep("credentials");
                  }}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  Back to sign in
                </button>
              </div>

              <div className="pt-4">
                <p className="text-sm leading-relaxed text-slate-400 dark:text-slate-500">
                  For security, the verification code expires after a short time.
                </p>
              </div>
            </form>
          </div>
        )}

        {step === "forgot-password" && (
          <div className="space-y-8">
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 border border-primary/15 shadow-sm sm:h-14 sm:w-14">
                  <img src={logo} alt="Soltelco" className="h-16 w-16 object-contain sm:h-16 sm:w-16" />
                </div>

                <div>
                  <p className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">Soltelco</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Business Portal</p>
                </div>
              </div>

              <div className="pt-2">
                <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                  Forgot password?
                </h1>
                <p className="mt-3 max-w-md text-base leading-relaxed text-slate-500 dark:text-slate-400 sm:text-lg">
                  Enter your email address and we'll send you a reset code to continue.
                </p>
              </div>
            </div>

            {error ? <AuthAlert type="error" message={error} title={errorTitle} /> : null}
            {info ? <AuthAlert type="success" message={info} /> : null}

            <form onSubmit={onForgotPasswordSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Email address
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-slate-400 dark:text-slate-500">
                    mail
                  </span>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@company.com"
                    className="h-14 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-slate-900 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-900 dark:focus:ring-primary/30"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSendingReset}
                className="h-14 w-full rounded-xl bg-primary text-base font-semibold text-white shadow-lg shadow-primary/25 transition hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
              >
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
                className="h-12 w-full rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Back to sign in
              </button>

              <div className="pt-4">
                <p className="text-sm leading-relaxed text-slate-400 dark:text-slate-500">
                  We'll only use your email to send the password reset code.
                </p>
              </div>
            </form>
          </div>
        )}

        {step === "reset-password" && (
          <div className="space-y-8">
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 border border-primary/15 shadow-sm sm:h-14 sm:w-14">
                  <img src={logo} alt="Soltelco" className="h-16 w-16 object-contain sm:h-16 sm:w-16" />
                </div>

                <div>
                  <p className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">Soltelco</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Business Portal</p>
                </div>
              </div>

              <div className="pt-2">
                <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                  Reset your password
                </h1>
                <p className="mt-3 max-w-md text-base leading-relaxed text-slate-500 dark:text-slate-400 sm:text-lg">
                  Enter the reset code and choose a new password.
                </p>
              </div>
            </div>

            {error ? <AuthAlert type="error" message={error} title={errorTitle} /> : null}
            {info ? <AuthAlert type="success" message={info} /> : null}

            <form onSubmit={onResetPasswordSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Email address
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-slate-400 dark:text-slate-500">
                    mail
                  </span>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@company.com"
                    className="h-14 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-slate-900 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-900 dark:focus:ring-primary/30"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Reset Code
                </label>

                <div className="flex justify-between gap-2 sm:gap-3" onPaste={handleOtpPaste}>
                  {otpCode.map((digit, index) => (
                    <input
                      key={index}
                      id={`reset-otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => {
                        const value = e.target.value;
                        handleOtpChange(index, value);

                        if (value && index < 5) {
                          const next = document.getElementById(`reset-otp-${index + 1}`) as HTMLInputElement;
                          if (next) next.focus();
                        }
                      }}
                      onKeyDown={(e) => handleOtpKeyDown(index, e, "reset-otp")}
                      className="h-14 w-11 rounded-2xl border border-slate-200 bg-slate-50 text-center text-lg font-semibold text-slate-900 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-900 dark:focus:ring-primary/30 sm:h-14 sm:w-12"
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
                    className={`h-14 w-full rounded-xl border bg-slate-50 pl-12 pr-12 text-slate-900 outline-none transition focus:bg-white focus:ring-1 focus:ring-primary/20 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-900 dark:focus:ring-primary/30 ${
                      newPassword && !passwordValidation.isValid
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-100 dark:border-red-400 dark:focus:border-red-500 dark:focus:ring-red-900/20'
                        : 'border-slate-200 focus:border-primary dark:border-slate-700'
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
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
                className="h-14 w-full rounded-xl bg-primary text-base font-semibold text-white shadow-lg shadow-primary/25 transition hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
              >
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
                className="h-12 w-full rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Back to sign in
              </button>

              <div className="pt-4">
                <p className="text-sm text-slate-400 dark:text-slate-500">
                  Make sure your new password is secure and not used before.
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </CustomerAuthLayout>
  );
}
