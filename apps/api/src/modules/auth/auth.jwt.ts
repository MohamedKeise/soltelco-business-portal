import * as jwt from "jsonwebtoken";
import { env } from "../../config/env";

export type Role =
  | "ENTERPRISE"
  | "DEVELOPER"
  | "RESELLER"
  | "ADMIN"
  | "SUPER_ADMIN";

export type JwtUserPayload = {
  sub: string; // userId
  role: Role;
};

export function signAccessToken(payload: JwtUserPayload) {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, { 
    expiresIn: env.JWT_ACCESS_EXPIRES 
  } as jwt.SignOptions);
}

export function signRefreshToken(payload: JwtUserPayload) {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, { 
    expiresIn: env.JWT_REFRESH_EXPIRES 
  } as jwt.SignOptions);
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtUserPayload;
}
