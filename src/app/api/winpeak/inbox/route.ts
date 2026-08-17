import { prisma } from '@/lib/db';
import { requireAdmin, unauthorized } from '@/lib/admin-auth';

export async function GET() {
	const session = await requireAdmin();

	if (!session) {
		return unauthorized();
	}

	const messages = await prisma.contactMessage.findMany({
		orderBy: { createdAt: 'desc' }
	});

	return Response.json(
		messages.map((message) => ({
			id: message.id,
			name: message.name,
			email: message.email,
			phone: message.phone,
			message: message.message,
			read: message.read,
			createdAt: message.createdAt.toISOString()
		}))
	);
}
