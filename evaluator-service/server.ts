import express from "express";
import { logger } from "./src/config/logger.config";
import { v1Router } from "./src/routers/index.router";
import { startEvaluationWorkers } from "./src/workers/evaluate-submission.worker";
import { startRunWorker } from "./src/workers/evaluate-run.worker";
import { pullAllImages } from "./src/docker/utils/pullImage.util";
import { jwtMiddlewWare } from "./src/middlewares/jwt.middlware";

const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.json());

// ROUTES
app.use("/api/v1", jwtMiddlewWare, v1Router);

app.get("/", (_, res) => {
	res.send("ok");
});

app.listen(PORT, async () => {
	logger.info(`SERVER IS RUNNING AT PORT: ${PORT}`);
	await Promise.all([
		startEvaluationWorkers(),
		startRunWorker(),
		pullAllImages(),
	]);
});
