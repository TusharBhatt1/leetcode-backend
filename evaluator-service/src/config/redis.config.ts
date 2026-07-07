import Redis from "ioredis";
import { redisConfig } from ".";
import { logger } from "./logger.config";

const config = {
	host: redisConfig.HOST,
	port: Number(redisConfig.PORT),
	maxRetriesPerRequest: null,
};

export const redisClient = new Redis(config);

redisClient.on("connect", () => {
	logger.info("Connected to redis server successfully");
});

redisClient.on("error", (error) => {
	logger.error("Redis connection error", error);
});

export const createNewRedisConnection = () => {
	return new Redis(config);
};
