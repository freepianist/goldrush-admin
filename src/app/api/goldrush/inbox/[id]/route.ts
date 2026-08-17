import { prisma } from '@/lib/db';
import { notFound, requireAdmin, unauthorized } from '@/lib/admin-auth';

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
	const session = await requireAdmin();

	if (!session) {
		return unauthorized();
	}

	const { id } = await context.params;
	const existing = await prisma.contactMessage.findUnique({ where: { id } });

	if (!existing) {
		return notFound('Message not found');
	}

	const body = (await request.json()) as { read?: boolean };
	const message = await prisma.contactMessage.update({
		where: { id },
		data: { read: body.read ?? true }
	});

	return Response.json({
		id: message.id,
		name: message.name,
		email: message.email,
		phone: message.phone,
		message: message.message,
		read: message.read,
		createdAt: message.createdAt.toISOString()
	});
}

export async function DELETE(_request: Request, context: RouteContext) {
	const session = await requireAdmin();

	if (!session) {
		return unauthorized();
	}

	const { id } = await context.params;
	await prisma.contactMessage.delete({ where: { id } }).catch(() => null);

	return Response.json({ success: true });
}
