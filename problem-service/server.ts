import express from "express";
import { logger } from "./src/config/logger.config";
import { connectDB } from "./src/config/db.config";

const PORT = process.env.PORT || 3000;
const app = express();

app.get("/", (_, res) => {
	res.send("ok");
});

app.listen(PORT, async() => {
	logger.info(`SERVER IS RUNNING AT PORT: ${PORT}`);
    await connectDB()
});
