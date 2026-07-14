import express from "express";
import cors from "cors";
import { logger } from "./src/config/logger.config";
import { connectDB } from "./src/config/db.config";
import { v1Router } from "./src/routers/index.router";
import cookieParser from "cookie-parser";
import "./src/config/redis.config";
import { jwtMiddlewWare } from "./src/middlewares/jwt.middleware";

const PORT = process.env.PORT || 3000;
const app = express();
app.use(
	cors({
		origin: ["http://localhost:4000","http://localhost:3001"],
		credentials: true,
	}),
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", jwtMiddlewWare, v1Router);

app.get("/", (_, res) => {
	res.send("ok");
});

app.listen(PORT, async () => {
	logger.info(`SERVER IS RUNNING AT PORT: ${PORT}`);
	await connectDB();
});
