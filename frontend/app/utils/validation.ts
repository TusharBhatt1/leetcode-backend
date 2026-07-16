export function validateEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

export function validatePassword(password: string): {
	valid: boolean;
	errors: string[];
} {
	const errors: string[] = [];

	if (password.length < 6) {
		errors.push("Password must be at least 6 characters long");
	}

	return {
		valid: errors.length === 0,
		errors,
	};
}

export function isValidProblemId(id: string): boolean {
	return !!(id && id.length > 0 && id !== "undefined");
}

export function isEmptyString(value: string | undefined): boolean {
	return !value || value.trim().length === 0;
}
