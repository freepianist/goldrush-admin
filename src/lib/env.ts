const REQUIRED_IN_PRODUCTION = ['DATABASE_URL', 'AUTH_SECRET', 'ADMIN_EMAIL', 'ADMIN_PASSWORD'];
const LOCAL_FALLBACK = 'http://localhost:3000';

export function assertServerEnv() {
	if (process.env.NODE_ENV !== 'production') {
		return;
	}

	const missing = REQUIRED_IN_PRODUCTION.filter((key) => !process.env[key]?.trim());

	if (missing.length) {
		throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
	}
}

/** Vercel often stores hosts without a scheme; `new URL()` requires one. */
export function normalizeSiteUrl(value?: string | null, fallback = LOCAL_FALLBACK): string {
	const raw = String(value || '').trim().replace(/\/+$/, '');
	const candidate = raw || fallback;

	try {
		return new URL(candidate).origin;
	} catch {
		const host = candidate.replace(/^\/+/, '');
		const withProtocol = /^(localhost|127\.0\.0\.1)(:\d+)?$/i.test(host)
			? `http://${host}`
			: `https://${host}`;

		try {
			return new URL(withProtocol).origin;
		} catch {
			return fallback;
		}
	}
}

export function getSiteUrl() {
	return normalizeSiteUrl(
		process.env.NEXT_PUBLIC_BASE_URL ||
			process.env.AUTH_URL ||
			(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined)
	);
}
