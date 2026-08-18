import '@/lib/env';
import NextAuth from 'next-auth';
import { User } from '@auth/user';
import { createStorage } from 'unstorage';
import memoryDriver from 'unstorage/drivers/memory';
import vercelKVDriver from 'unstorage/drivers/vercel-kv';
import { UnstorageAdapter } from '@auth/unstorage-adapter';
import type { NextAuthConfig } from 'next-auth';
import type { Provider } from 'next-auth/providers';
import Credentials from 'next-auth/providers/credentials';
import { authGetDbUserByEmail, authCreateDbUser } from './authApi';
import { prisma } from '@/lib/db';
import { verifyAffiliatePassword } from '@/lib/affiliates';

const storage = createStorage({
	driver: process.env.VERCEL
		? vercelKVDriver({
				url: process.env.AUTH_KV_REST_API_URL,
				token: process.env.AUTH_KV_REST_API_TOKEN,
				env: false
			})
		: memoryDriver()
});

export const providers: Provider[] = [
	Credentials({
		async authorize(formInput) {
			if (formInput.formType !== 'signin') {
				return null;
			}

			const email = String(formInput.email || '')
				.trim()
				.toLowerCase();
			const password = String(formInput.password || '');
			const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
			const adminPassword = process.env.ADMIN_PASSWORD;

			if (adminEmail && adminPassword && email && password && email === adminEmail && password === adminPassword) {
				return {
					email: adminEmail,
					name: 'WinPeak Admin',
					role: 'admin'
				};
			}

			if (!email || !password) {
				return null;
			}

			try {
				const partner = await prisma.affiliatePartner.findUnique({
					where: { email }
				});

				if (
					partner?.passwordHash &&
					(partner.status === 'ACTIVE' || partner.status === 'INVITED') &&
					(await verifyAffiliatePassword(password, partner.passwordHash))
				) {
					if (partner.status === 'INVITED') {
						await prisma.affiliatePartner.update({
							where: { id: partner.id },
							data: { status: 'ACTIVE' }
						});
					}

					return {
						email: partner.email,
						name: partner.name,
						role: 'affiliate',
						partnerId: partner.id
					};
				}
			} catch (error) {
				console.error('Affiliate login failed', error);
			}

			return null;
		}
	})
];

const config = {
	theme: { logo: '/assets/images/logo/winpeak-logo.png' },
	adapter: UnstorageAdapter(storage),
	pages: {
		signIn: '/sign-in'
	},
	providers,
	basePath: '/auth',
	trustHost: true,
	callbacks: {
		authorized() {
			/** Checkout information to how to use middleware for authorization
			 * https://next-auth.js.org/configuration/nextjs#middleware
			 */
			return true;
		},
		jwt({ token, trigger, account, user }) {
			if (user) {
				const signedIn = user as { role?: string; partnerId?: string; name?: string | null };
				token.role = signedIn.role || 'admin';
				token.partnerId = signedIn.partnerId;
				token.name = signedIn.name || token.name;
			}

			if (trigger === 'update') {
				token.name = user.name;
			}

			if (account?.provider === 'keycloak') {
				return { ...token, accessToken: account.access_token };
			}

			return token;
		},
		async session({ session, token }) {
			if (token.accessToken && typeof token.accessToken === 'string') {
				session.accessToken = token.accessToken;
			}

			if (token.role === 'affiliate') {
				session.db = {
					id: String(token.partnerId || ''),
					role: ['affiliate'],
					displayName: String(token.name || 'Partner'),
					email: session.user.email,
					photoURL: '',
					shortcuts: [],
					settings: {},
					loginRedirectUrl: '/dashboards/partner'
				};
				return session;
			}

			if (session) {
				try {
					/**
					 * Get the session user from database
					 */
					const response = await authGetDbUserByEmail(session.user.email);

					const userDbData = (await response.json()) as User;

					session.db = userDbData;

					return session;
				} catch (error) {
					const errorStatus = error?.status;

					/** If user not found, create a new user */
					if (errorStatus === 404) {
						const newUserResponse = await authCreateDbUser({
							email: session.user.email,
							role: ['admin'],
							displayName: session.user.name,
							photoURL: session.user.image
						});

						const newUser = (await newUserResponse.json()) as User;

						console.error('Error fetching user data:', error);

						session.db = newUser;

						return session;
					}

					throw error;
				}
			}

			return null;
		}
	},
	experimental: {
		enableWebAuthn: true
	},
	session: {
		strategy: 'jwt',
		maxAge: 30 * 24 * 60 * 60 // 30 days
	},
	debug: process.env.NODE_ENV !== 'production'
} satisfies NextAuthConfig;

export type { AuthJsProvider } from './authJsProviders';
export { authJsProviderMap } from './authJsProviders';

export const { handlers, auth, signIn, signOut } = NextAuth(config);
