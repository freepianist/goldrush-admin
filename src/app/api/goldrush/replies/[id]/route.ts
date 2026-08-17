import { prisma } from '@/lib/db';
import { requireAdmin, unauthorized } from '@/lib/admin-auth';

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, context: RouteContext) {
	const session = await requireAdmin();

	if (!session) {
		return unauthorized();
	}

	const { id } = await context.params;
	await prisma.gameReviewReply.delete({ where: { id } }).catch(() => null);

	return Response.json({ success: true });
}
