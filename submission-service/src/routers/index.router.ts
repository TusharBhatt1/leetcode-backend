import express from "express";
import { submissionRouter } from "./v1/submission.router";

const v1Router = express.Router();

v1Router.use("/submission", submissionRouter);

export { v1Router };

