import express from "express";
import { validateRequestBody } from "@/middlewares/validateRequestbody.middleware";
import { logInUserSchema } from "@/validators/signup.validator";
import { LoginController } from "@/controllers/login.controller";

export const loginRouter = express.Router();

loginRouter.post(
	"/",
	validateRequestBody(logInUserSchema),
	LoginController.login,
);
