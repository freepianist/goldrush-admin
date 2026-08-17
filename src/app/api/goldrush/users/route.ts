import { prisma } from '@/lib/db';
import { requireAdmin, unauthorized } from '@/lib/admin-auth';
import { serializeUser } from '@/lib/serializers';

export async function GET() {
	const session = await requireAdmin();

	if (!session) {
		return unauthorized();
	}

	const users = await prisma.user.findMany({
		orderBy: { createdAt: 'desc' },
		include: {
			wallet: true,
			_count: { select: { ledger: true, reviews: true } }
		}
	});

	return Response.json(users.map(serializeUser));
}
