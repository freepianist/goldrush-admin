import { prisma } from '@/lib/db';
import { requireAdmin, unauthorized } from '@/lib/admin-auth';

export async function GET() {
	const session = await requireAdmin();

	if (!session) {
		return unauthorized();
	}

	const subscribers = await prisma.newsletterSubscriber.findMany({
		orderBy: { createdAt: 'desc' }
	});

	return Response.json(
		subscribers.map((subscriber) => ({
			id: subscriber.id,
			email: subscriber.email,
			createdAt: subscriber.createdAt.toISOString()
		}))
	);
}

export async function DELETE(request: Request) {
	const session = await requireAdmin();

	if (!session) {
		return unauthorized();
	}

	const body = (await request.json()) as { ids?: string[] };
	const ids = body.ids || [];

	if (ids.length) {
		await prisma.newsletterSubscriber.deleteMany({ where: { id: { in: ids } } });
	}

	return Response.json({ success: true });
}
