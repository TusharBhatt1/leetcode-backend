import express from "express";
import { logger } from "./src/config/logger.config";
import { connectDB } from "./src/config/db.config";
import { v1Router } from "./src/routers/index.router";
import { rateLimit } from "express-rate-limit";
import { jwtMiddlewWare } from "./src/middlewares/jwt.middleware";
import cookieParser from "cookie-parser";
import cors from "cors";

const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin: ["http://localhost:4000"],
		credentials: true,
	}),
);

// app.use(limiter);

// ROUTES
app.use("/api/v1", jwtMiddlewWare, v1Router);

app.get("/", (_, res) => {
	res.send("ok");
});

app.listen(PORT, async () => {
	logger.info(`SERVER IS RUNNING AT PORT: ${PORT}`);
	await connectDB();
});
