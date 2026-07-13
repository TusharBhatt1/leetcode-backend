import { authConfig } from "@/config";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export interface IJwtUser {
	name: string;
	role: UserRole;
	id: mongoose.Schema.Types.ObjectId;
}
export enum UserRole {
	CANDIDATE = "candidate",
	PROBLEM_SETTER = "problem_setter",
	ADMIN = "admin",
}

export async function jwtMiddlewWare(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const token = req.cookies.leetcode_user || req.headers.token;
		if (!token) {
			throw new Error("Unauthenticated, token not found.");
		}

		const verifyToken = jwt.verify(token, authConfig.JWT_PUBIC_KEY!, {
			algorithms: ["RS256"],
		}) as IJwtUser;
		//@ts-ignore
		req.user = verifyToken;

		next();
	} catch (error) {
		return res.status(401).json({
			message:
				error instanceof Error
					? error.message
					: "Unauthenticated, please login or signup.",
			success: false,
		});
	}
}
