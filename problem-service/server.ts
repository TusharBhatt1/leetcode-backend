import express from "express";
import cors from "cors";
import { logger } from "./src/config/logger.config";
import { connectDB } from "./src/config/db.config";
import { v1Router } from "./src/routers/index.router";
import "./src/config/redis.config";

const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1", v1Router);

app.get("/", (_, res) => {
	res.send("ok");
});

app.listen(PORT, async () => {
	logger.info(`SERVER IS RUNNING AT PORT: ${PORT}`);
	await connectDB();
});
