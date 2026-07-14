import "dotenv/config";

export const dbConfig = {
	DB_URL: process.env.DB_URL,
};

export const authConfig = {
	JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY,
	JWT_PUBLIC_KEY: process.env.JWT_PUBLIC_KEY,
};
