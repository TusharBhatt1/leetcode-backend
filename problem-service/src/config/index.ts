import "dotenv/config";

export const dbConfig = {
	DB_URL: process.env.DB_URL || 3001,
};

export const authConfig = {
	JWT_PUBIC_KEY: process.env.JWT_PUBIC_KEY,
};
