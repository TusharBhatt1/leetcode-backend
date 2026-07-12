import express from "express";
import { SignUpController } from "@/controllers/signup.controller";
import { validateRequestBody } from "@/middlewares/validateRequestbody.middleware";
import { signUpUserSchema } from "@/validators/signup.validator";

export const signupRouter = express.Router();

signupRouter.post(
	"/",
	validateRequestBody(signUpUserSchema),
	SignUpController.signUp,
);
