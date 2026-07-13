import { authConfig } from "@/config";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export enum UserRole {
	CANDIDATE = "candidate",
	PROBLEM_SETTER = "problem_setter",
	ADMIN = "admin",
}

export async function rbacMiddlewWare(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const token = await req.cookies.leetcode_user;
		if (!token) {
			throw new Error("Unauthenticated, token not found.");
		}

		const verifyToken = jwt.verify(token, authConfig.JWT_PUBIC_KEY!, {
			algorithms: ["RS256"],
		});
		const { role } = verifyToken as { role: String };

		if (role !== UserRole.ADMIN && role !== UserRole.PROBLEM_SETTER) {
			return res.status(403).json({
				message: "Unauthorized, only Admin and Problem setter can access it.",
				success: false,
			});
		}
		next();
	} catch (error) {
		return res.status(401).json({
			message: error instanceof Error ? error.message : "Unauthenticated",
			success: false,
		});
	}
}
