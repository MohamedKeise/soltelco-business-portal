import nodemailer from "nodemailer";
import { env } from "../../config/env";

const transporter = nodemailer.createTransport({
  host: env.MAIL_HOST,
  port: env.MAIL_PORT,
  secure: false,
  auth: {
    user: env.MAIL_USER,
    pass: env.MAIL_PASS,
  },
});

export async function sendOtpEmail(to: string, otpCode: string) {
  try {
    await transporter.sendMail({
      from: `${env.MAIL_FROM_NAME} <${env.MAIL_USER}>`,
      to,
      subject: "Login Access Key",
      text: `SOLTELCO BUSINESS

Your access code is ${otpCode}.

Do not share this code with anyone.
This code expires in 5 minutes.`,
    });
  } catch (error: any) {
    console.error("Email error details:", {
      code: error.code,
      message: error.message,
      errno: error.errno,
      syscall: error.syscall,
      hostname: error.hostname
    });

    // Detect various network/connectivity issues
    const networkErrorCodes = [
      "ENOTFOUND",      // DNS lookup failed
      "ECONNREFUSED",   // Connection refused
      "ETIMEDOUT",      // Connection timed out
      "EHOSTUNREACH",   // Host unreachable
      "ENETUNREACH",    // Network unreachable
      "ECONNRESET",     // Connection reset
      "EAI_AGAIN",       // Temporary DNS failure
      "ENETDOWN",       // Network is down
      "EHOSTDOWN",      // Host is down
      "EPIPE",          // Broken pipe
      "EPROTO",         // Protocol error
      "ECONNABORTED",   // Connection aborted
    ];

    // Check error code first
    if (networkErrorCodes.includes(error.code)) {
      console.log("Detected network error by code:", error.code);
      throw new Error("No internet connection");
    }

    // Check for timeout errors
    if (error.message && error.message.includes("timeout")) {
      console.log("Detected timeout error:", error.message);
      throw new Error("No internet connection");
    }

    // Check for general network errors in message
    if (error.message && (
      error.message.includes("network") || 
      error.message.includes("connection") ||
      error.message.includes("reachability") ||
      error.message.includes("unreachable") ||
      error.message.includes("offline") ||
      error.message.includes("dns")
    )) {
      console.log("Detected network error by message:", error.message);
      throw new Error("No internet connection");
    }

    // Check for nodemailer-specific connection issues
    if (error.message && (
      error.message.includes("Greeting never received") ||
      error.message.includes("Mail command failed") ||
      error.message.includes("Connection closed") ||
      error.message.includes("Socket timeout") ||
      error.message.includes("getaddrinfo")
    )) {
      console.log("Detected nodemailer network error:", error.message);
      throw new Error("No internet connection");
    }

    console.log("Falling back to generic email error for:", error.message);
    throw new Error("Failed to send email. Please try again later.");
  }
}

export async function sendResetPasswordEmail(to: string, resetCode: string) {
  try {
    await transporter.sendMail({
      from: `${env.MAIL_FROM_NAME} <${env.MAIL_USER}>`,
      to,
      subject: "Password Reset Code",
      text: `SOLTELCO BUSINESS

Your password reset code is ${resetCode}.

Do not share this code with anyone.
This code expires in 10 minutes.`,
    });
  } catch (error: any) {
    console.error("Email error details:", {
      code: error.code,
      message: error.message,
      errno: error.errno,
      syscall: error.syscall,
      hostname: error.hostname
    });

    // Detect various network/connectivity issues
    const networkErrorCodes = [
      "ENOTFOUND",      // DNS lookup failed
      "ECONNREFUSED",   // Connection refused
      "ETIMEDOUT",      // Connection timed out
      "EHOSTUNREACH",   // Host unreachable
      "ENETUNREACH",    // Network unreachable
      "ECONNRESET",     // Connection reset
      "EAI_AGAIN",       // Temporary DNS failure
      "ENETDOWN",       // Network is down
      "EHOSTDOWN",      // Host is down
      "EPIPE",          // Broken pipe
      "EPROTO",         // Protocol error
      "ECONNABORTED",   // Connection aborted
    ];

    // Check error code first
    if (networkErrorCodes.includes(error.code)) {
      console.log("Detected network error by code:", error.code);
      throw new Error("No internet connection");
    }

    // Check for timeout errors
    if (error.message && error.message.includes("timeout")) {
      console.log("Detected timeout error:", error.message);
      throw new Error("No internet connection");
    }

    // Check for general network errors in message
    if (error.message && (
      error.message.includes("network") || 
      error.message.includes("connection") ||
      error.message.includes("reachability") ||
      error.message.includes("unreachable") ||
      error.message.includes("offline") ||
      error.message.includes("dns")
    )) {
      console.log("Detected network error by message:", error.message);
      throw new Error("No internet connection");
    }

    // Check for nodemailer-specific connection issues
    if (error.message && (
      error.message.includes("Greeting never received") ||
      error.message.includes("Mail command failed") ||
      error.message.includes("Connection closed") ||
      error.message.includes("Socket timeout") ||
      error.message.includes("getaddrinfo")
    )) {
      console.log("Detected nodemailer network error:", error.message);
      throw new Error("No internet connection");
    }

    console.log("Falling back to generic email error for:", error.message);
    throw new Error("Failed to send email. Please try again later.");
  }
}
