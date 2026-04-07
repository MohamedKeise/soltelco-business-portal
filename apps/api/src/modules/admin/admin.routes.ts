import { Router } from "express";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { requireAuth, AuthedRequest } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/rbac.middleware";
import { db } from "../../config/db";
import { Role } from "../auth/auth.jwt";
import { findUserByEmail } from "../auth/auth.service";

export const adminRoutes = Router();

adminRoutes.post(
  "/users",
  requireAuth,
  requireRole("ADMIN", "SUPER_ADMIN"),
  async (req: AuthedRequest, res) => {
    const { email, password, role } = req.body as {
      email?: string;
      password?: string;
      role?: Role;
    };

    if (!email || !password || !role) {
      return res.status(400).json({ message: "email, password, role required" });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    if (req.user?.role === "ADMIN") {
      const allowedRoles: Role[] = ["ENTERPRISE", "DEVELOPER", "RESELLER"];

      if (!allowedRoles.includes(role)) {
        return res.status(403).json({
          message: "ADMIN can only create customer roles",
        });
      }
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUserId = uuidv4();

    await db.query(
      `INSERT INTO users (id, email, password_hash, role)
       VALUES ($1, $2, $3, $4)`,
      [newUserId, email, passwordHash, role]
    );

    return res.status(201).json({
      id: newUserId,
      email,
      role,
    });
  }
);