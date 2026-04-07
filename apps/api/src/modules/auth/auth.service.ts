import { db } from "../../config/db";
import { Role } from "./auth.jwt";

export async function findUserByEmail(email: string) {
  const result = await db.query(
    `SELECT id, email, password_hash, role, otp_code, otp_expires_at
     FROM users
     WHERE LOWER(email) = LOWER($1)
     LIMIT 1`,
    [email]
  );

  if (result.rows.length === 0) return null;

  const row = result.rows[0];

  return {
    id: row.id as string,
    email: row.email as string,
    passwordHash: row.password_hash as string,
    role: row.role as Role,
    otpCode: row.otp_code as string | null,
    otpExpiresAt: row.otp_expires_at as Date | null,
  };
}

export async function saveUserOtp(userId: string, otpCode: string, otpExpiresAt: Date) {
  await db.query(
    `UPDATE users
     SET otp_code = $2,
         otp_expires_at = $3
     WHERE id = $1`,
    [userId, otpCode, otpExpiresAt]
  );
}

export async function clearUserOtp(userId: string) {
  await db.query(
    `UPDATE users
     SET otp_code = NULL,
         otp_expires_at = NULL
     WHERE id = $1`,
    [userId]
  );
}

export async function findUserByEmailAndOtp(email: string, otpCode: string) {
  const result = await db.query(
    `SELECT id, email, password_hash, role, otp_code, otp_expires_at
     FROM users
     WHERE LOWER(email) = LOWER($1)
       AND otp_code = $2
     LIMIT 1`,
    [email, otpCode]
  );

  if (result.rows.length === 0) return null;

  const row = result.rows[0];

  return {
    id: row.id as string,
    email: row.email as string,
    passwordHash: row.password_hash as string,
    role: row.role as Role,
    otpCode: row.otp_code as string | null,
    otpExpiresAt: row.otp_expires_at as Date | null,
  };
}

export async function saveUserResetCode(
  userId: string,
  resetCode: string,
  resetCodeExpiresAt: Date
) {
  await db.query(
    `UPDATE users
     SET reset_code = $2,
         reset_code_expires_at = $3
     WHERE id = $1`,
    [userId, resetCode, resetCodeExpiresAt]
  );
}

export async function findUserByEmailAndResetCode(email: string, resetCode: string) {
  const result = await db.query(
    `SELECT id, email, password_hash, role, reset_code, reset_code_expires_at
     FROM users
     WHERE LOWER(email) = LOWER($1)
       AND reset_code = $2
     LIMIT 1`,
    [email, resetCode]
  );

  if (result.rows.length === 0) return null;

  const row = result.rows[0];

  return {
    id: row.id as string,
    email: row.email as string,
    passwordHash: row.password_hash as string,
    role: row.role as Role,
    resetCode: row.reset_code as string | null,
    resetCodeExpiresAt: row.reset_code_expires_at as Date | null,
  };
}

export async function clearUserResetCode(userId: string) {
  await db.query(
    `UPDATE users
     SET reset_code = NULL,
         reset_code_expires_at = NULL
     WHERE id = $1`,
    [userId]
  );
}

export async function updateUserPassword(userId: string, passwordHash: string) {
  await db.query(
    `UPDATE users
     SET password_hash = $2
     WHERE id = $1`,
    [userId, passwordHash]
  );
}
