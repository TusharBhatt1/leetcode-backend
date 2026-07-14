// src/lib/axios.ts

import axios from "axios";
const SERVICES = {
	auth: process.env.NEXT_PUBLIC_AUTH_SERVICE,
	submission: process.env.NEXT_PUBLIC_SUBMISSION_SERVICE,
	default: process.env.NEXT_PUBLIC_PROBLEM_SERVICE,
};

export const apiClient = axios.create({
	timeout: 5000,
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials:true
});


// 3. Intercept every request to dynamically assign the baseURL
apiClient.interceptors.request.use(
	(config) => {
		const url = config.url || "";

		// Check URL path prefixes
		if (url.startsWith("/login") || url.startsWith("/signup")) {
			config.baseURL = SERVICES.auth;
		} else if (url.startsWith("/submission")) {
			config.baseURL = SERVICES.submission;
		} else {
			config.baseURL = SERVICES.default;
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

export default apiClient;
