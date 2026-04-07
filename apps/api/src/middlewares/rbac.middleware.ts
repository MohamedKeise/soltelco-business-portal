import type { NextFunction, Response } from "express";
import { AuthedRequest } from "./auth.middleware";

export function requireRole(...allowedRoles: string[]) {
  return (req: AuthedRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: role not allowed" });
    }

    return next();
  };
}
