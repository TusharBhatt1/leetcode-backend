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
	withCredentials: true,
});

apiClient.interceptors.request.use(
	(config) => {
		const url = config.url || "";
		const token =
			typeof window !== "undefined" ? localStorage.getItem("token") : null;

		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}

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

apiClient.interceptors.response.use(
	(response) => response,
	(error) => {
		return Promise.reject(error?.response?.data);
	},
);

export default apiClient;
