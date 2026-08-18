import { prisma } from '@/lib/db';
import { badRequest, notFound, requireAdmin, unauthorized } from '@/lib/admin-auth';
import { serializeCommission } from '@/lib/affiliates';

type RouteContext = { params: Promise<{ id: string }> };

const STATUSES = new Set(['PENDING', 'APPROVED', 'PAID', 'VOID']);

export async function PATCH(request: Request, context: RouteContext) {
	const session = await requireAdmin();

	if (!session) {
		return unauthorized();
	}

	const { id } = await context.params;
	const body = (await request.json()) as { status?: string };
	const status = String(body.status || '').toUpperCase();

	if (!STATUSES.has(status)) {
		return badRequest('Status must be PENDING, APPROVED, PAID, or VOID');
	}

	const existing = await prisma.affiliateCommission.findUnique({ where: { id } });

	if (!existing) {
		return notFound('Commission not found');
	}

	const updated = await prisma.affiliateCommission.update({
		where: { id },
		data: { status: status as 'PENDING' | 'APPROVED' | 'PAID' | 'VOID' },
		include: {
			partner: { select: { name: true, email: true, code: true } },
			user: { select: { firstName: true, lastName: true, email: true } }
		}
	});

	return Response.json(serializeCommission(updated));
}
