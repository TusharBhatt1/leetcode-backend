import mongoose from "mongoose";
import { logger } from "./logger.config";
import { dbConfig } from ".";

export const connectDB = async () => {
	try {
		await mongoose.connect(String(dbConfig.DB_URL));
		logger.info("Connected to DB");
		mongoose.connection.on("error", (error) => {
			logger.error("Mongo DB connection error", error);
		});
		mongoose.connection.on("disconnected", () => {
			logger.warn("Mongo DB disconnected");
		});

		process.on("SIGINT", () => {
			mongoose.connection.close();
			logger.info("Mongo DB connection closed");
			process.exit(0);
		});
	} catch (error) {
		logger.error("Something went wrong with connecting to DB");
		process.exit(1);
	}
};
