import { prisma } from '@/lib/db';
import { badRequest, notFound, requireAdmin, unauthorized } from '@/lib/admin-auth';

type RouteContext = { params: Promise<{ id: string }> };

function serializeStory(story: {
	id: string;
	authorName: string;
	role: string;
	content: string;
	image: string;
	rating: number;
	createdAt: Date;
}) {
	return {
		id: story.id,
		authorName: story.authorName,
		role: story.role,
		content: story.content,
		image: story.image,
		rating: story.rating,
		createdAt: story.createdAt.toISOString()
	};
}

export async function GET(_request: Request, context: RouteContext) {
	const session = await requireAdmin();

	if (!session) {
		return unauthorized();
	}

	const { id } = await context.params;
	const story = await prisma.successStory.findUnique({ where: { id } });

	if (!story) {
		return notFound('Story not found');
	}

	return Response.json(serializeStory(story));
}

export async function PUT(request: Request, context: RouteContext) {
	const session = await requireAdmin();

	if (!session) {
		return unauthorized();
	}

	const { id } = await context.params;
	const existing = await prisma.successStory.findUnique({ where: { id } });

	if (!existing) {
		return notFound('Story not found');
	}

	const body = (await request.json()) as {
		authorName?: string;
		role?: string;
		content?: string;
		image?: string;
		rating?: number;
	};

	if (!body.authorName?.trim() || !body.content?.trim()) {
		return badRequest('Author name and content are required');
	}

	const story = await prisma.successStory.update({
		where: { id },
		data: {
			authorName: body.authorName.trim(),
			role: body.role?.trim() || 'Player',
			content: body.content.trim(),
			image: body.image?.trim() || existing.image,
			rating: Math.min(5, Math.max(1, Number(body.rating) || existing.rating))
		}
	});

	return Response.json(serializeStory(story));
}

export async function DELETE(_request: Request, context: RouteContext) {
	const session = await requireAdmin();

	if (!session) {
		return unauthorized();
	}

	const { id } = await context.params;
	await prisma.successStory.delete({ where: { id } }).catch(() => null);

	return Response.json({ success: true });
}
