import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel, UserRole } from "../models/user.model";
import { authConfig } from "@/config";

export interface IAuthUserDetails {
	name: string;
	email: string;
	password: string;
	role: UserRole;
}
const LoginController = {
	async login(req: Request, res: Response) {
		const user = req.body;
		const { email, password } = user as IAuthUserDetails;

		const [userExists] = await UserModel.find({
			email,
		});

		if (!userExists) {
			res.status(404).json({
				messsage: `User with ${email} not found`,
				success: false,
			});
		}

		const { _id: userId, name, role } = userExists;

		try {
			const passwordMatch = bcrypt.compare(password, userExists.password);

			if (!passwordMatch) {
				throw new Error("Incorrect password");
			}

			const token = jwt.sign(
				{
					userId,
					name,
					role,
					email,
				},
				authConfig.JWT_PRIVATE_KEY!,
				{
					algorithm: "RS256",
                    expiresIn:"1D"
				},
			);

			res.cookie("leetcode_user", token);
			res.status(200).json({
				message: "Login in successfull",
				success: true,
			});
		} catch (error) {
			res.status(401).json({
				message:
					error instanceof Error ? error.message : "Wrong email or password",
				success: false,
			});
		}
	},
};
