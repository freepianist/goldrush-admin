import { auth } from '@auth/authJs';

function rolesOf(role: string[] | string | null | undefined) {
	if (!role) return [];
	return Array.isArray(role) ? role : [role];
}

export async function requireAdmin() {
	const session = await auth();
	const roles = rolesOf(session?.db?.role);

	if (!session?.db || !roles.includes('admin')) {
		return null;
	}

	return session;
}

export function unauthorized() {
	return Response.json({ error: 'Unauthorized' }, { status: 401 });
}

export function badRequest(message: string) {
	return Response.json({ error: message }, { status: 400 });
}

export function notFound(message = 'Not found') {
	return Response.json({ error: message }, { status: 404 });
}
