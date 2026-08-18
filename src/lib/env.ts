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

function readEnv(name: string) {
	return (process.env as Record<string, string | undefined>)[name];
}

function writeEnv(name: string, value: string) {
	(process.env as Record<string, string | undefined>)[name] = value;
}

export function getSiteUrl() {
	return normalizeSiteUrl(
		readEnv('NEXT_PUBLIC_BASE_URL') ||
			readEnv('AUTH_URL') ||
			readEnv('NEXTAUTH_URL') ||
			(readEnv('VERCEL_URL') ? `https://${readEnv('VERCEL_URL')}` : undefined)
	);
}

/**
 * Auth.js does `new URL(AUTH_URL + '/auth')`. Vercel often stores a hostname
 * without a scheme, which throws. Rewrite via bracket access so Next.js cannot
 * inline `process.env.AUTH_URL` into an illegal assignment.
 */
export function applyAuthUrlEnv() {
	const siteUrl = getSiteUrl();

	writeEnv('AUTH_URL', siteUrl);
	writeEnv('AUTH_TRUST_HOST', 'true');

	if (readEnv('NEXTAUTH_URL')) {
		writeEnv('NEXTAUTH_URL', siteUrl);
	}

	if (readEnv('NEXT_PUBLIC_BASE_URL')) {
		writeEnv('NEXT_PUBLIC_BASE_URL', siteUrl);
	}
}
