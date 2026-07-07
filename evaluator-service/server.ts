import express from "express";
import { logger } from "./src/config/logger.config";
import { connectDB } from "./src/config/db.config";
import { v1Router } from "./src/routers/index.router";

const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.json());

// ROUTES
app.use("/api/v1", v1Router);

app.get("/", (_, res) => {
	res.send("ok");
});

app.listen(PORT, async () => {
	logger.info(`SERVER IS RUNNING AT PORT: ${PORT}`);
	await connectDB();
});
