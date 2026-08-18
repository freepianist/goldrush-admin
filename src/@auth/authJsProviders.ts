export type AuthJsProvider = {
	id: string;
	name: string;
	style?: {
		text?: string;
		bg?: string;
	};
};

/**
 * Client-safe provider list. Keep this file free of Node-only imports
 * (Prisma, pg, fs). WinPeak staff and affiliates sign in with credentials only.
 */
export const authJsProviderMap: AuthJsProvider[] = [];
