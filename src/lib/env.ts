const REQUIRED_IN_PRODUCTION = ['DATABASE_URL', 'AUTH_SECRET', 'ADMIN_EMAIL', 'ADMIN_PASSWORD'];

export function assertServerEnv() {
	if (process.env.NODE_ENV !== 'production') {
		return;
	}

	const missing = REQUIRED_IN_PRODUCTION.filter((key) => !process.env[key]?.trim());

	if (missing.length) {
		throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
	}
}
