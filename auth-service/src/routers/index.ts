import express from "express";
import { signupRouter } from "./v1/signup.router";
import { loginRouter } from "./v1/login.router";

export const v1Router = express.Router();

v1Router.use("/signup", signupRouter);
v1Router.use("/login", loginRouter);
