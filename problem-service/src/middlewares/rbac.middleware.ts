import { authConfig } from "@/config";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IJwtUser } from "./jwtMiddleware";

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
	//@ts-ignore
	const { role } = req.user as IJwtUser;
	if (role !== UserRole.ADMIN && role !== UserRole.PROBLEM_SETTER) {
		return res.status(403).json({
			message: "Unauthorized, only Admin and Problem setter can access it.",
			success: false,
		});
	}
	next();
}
