import { IAuthUserDetails } from "@/controllers/login.controller";
import mongoose from "mongoose";

export enum UserRole {
	CANDIDATE = "candidate",
	PROBLEM_SETTER = "problem_setter",
	ADMIN = "admin",
}

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Name is required"],
		},
		email: {
			type: String,
			required: [true, "Name is required"],
			unique: true,
			lowerCase: true,
			trim: true,
			match: [
				/^[^\s@]+@[^\s@]+\.[^\s@]+$/,
				"Please enter a valid email address",
			],
		},
		password: {
			type: String,
			required: [true, "Password is required"],
			minlength: [8, "Password must be at least 8 characters long"],
			select: false,
		},
		role: {
			type: String,
			enum: Object.values(UserRole),
			required: [
				true,
				"Role is required, valid roles are candidate, problem_setter or admin ",
			],
		},
	},
	{
		timestamps: true,
		toJSON: {
			transform: (_doc, ret: IAuthUserDetails & { _id: any; __v?: number }) => {
				delete (ret as any)?.__v;
				(ret as any).id = ret._id;
				delete (ret as any)?._id;
				delete (ret as any)?.password;
				return ret;
			},
		},
	},
);

export const UserModel = mongoose.model("user", userSchema);
