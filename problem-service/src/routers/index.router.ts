import express from "express";
import { problemRouter } from "./v1/problem.router";

const v1Router = express.Router();

v1Router.use("/problem", problemRouter);

export { v1Router };
