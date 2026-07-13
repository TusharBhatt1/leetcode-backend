import express from "express";
import { problemRouter } from "./v1/problem.router";
import { jwtMiddlewWare } from "@/middlewares/jwtMiddleware";

const v1Router = express.Router();

v1Router.use("/problem", jwtMiddlewWare, problemRouter);

export { v1Router };
