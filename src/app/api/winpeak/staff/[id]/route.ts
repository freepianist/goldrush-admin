import { prisma } from '@/lib/db';
import { badRequest, notFound, requireAdmin, unauthorized } from '@/lib/admin-auth';
import { hashAffiliatePassword } from '@/lib/affiliates';

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
	const session = await requireAdmin();

	if (!session) {
		return unauthorized();
	}

	const { id } = await context.params;
	const staff = await prisma.staffAccount.findUnique({ where: { id } });

	if (!staff) {
		return notFound('Manager not found');
	}

	const body = (await request.json()) as { name?: string; status?: string; password?: string };
	const data: Record<string, unknown> = {};

	if (body.name !== undefined) {
		const name = String(body.name).trim();

		if (!name) {
			return badRequest('Name is required');
		}

		data.name = name;
	}

	if (body.status !== undefined) {
		const status = String(body.status).toUpperCase();

		if (status !== 'ACTIVE' && status !== 'DISABLED') {
			return badRequest('Status must be ACTIVE or DISABLED');
		}

		data.status = status;
	}

	if (body.password) {
		if (String(body.password).length < 8) {
			return badRequest('Password must be at least 8 characters');
		}

		data.passwordHash = await hashAffiliatePassword(String(body.password));
	}

	const updated = await prisma.staffAccount.update({
		where: { id },
		data
	});

	return Response.json({
		id: updated.id,
		email: updated.email,
		name: updated.name,
		role: updated.role,
		status: updated.status,
		createdAt: updated.createdAt.toISOString(),
		updatedAt: updated.updatedAt.toISOString()
	});
}
