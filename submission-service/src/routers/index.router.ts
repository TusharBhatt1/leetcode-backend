import express from "express";
import { submissionRouter } from "./v1/submission.router";
import { runRouter } from "./v1/run.router";

const v1Router = express.Router();

v1Router.use("/submission", submissionRouter);
v1Router.use("/submission/run", runRouter);

export { v1Router };
