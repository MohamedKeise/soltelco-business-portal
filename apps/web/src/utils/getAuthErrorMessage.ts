export function getAuthErrorMessage(error: unknown, fallback = "Login failed") {
  const rawMessage = error instanceof Error ? error.message : "";

  // Map specific backend messages to clean user-facing messages
  if (rawMessage.includes("email, password and portal are required")) {
    return "Please enter your email and password.";
  }

  if (rawMessage.includes("No internet connection")) {
    return "Please check your internet connection and try again.";
  }

  if (rawMessage.includes("Failed to send email. Please try again later.")) {
    return "We could not send the verification code right now. Please try again.";
  }

  return rawMessage || fallback;
}
