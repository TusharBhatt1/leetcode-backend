import "dotenv/config";

export const dbConfig = {
	PORT: process.env.PORT,
	DB_URL: process.env.DB_URL || 3001,
};
