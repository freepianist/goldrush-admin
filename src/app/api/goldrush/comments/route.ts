import { prisma } from '@/lib/db';
import { requireAdmin, unauthorized } from '@/lib/admin-auth';

export async function GET() {
	const session = await requireAdmin();

	if (!session) {
		return unauthorized();
	}

	const comments = await prisma.blogComment.findMany({
		orderBy: { createdAt: 'desc' },
		include: { post: { select: { title: true, slug: true } } }
	});

	return Response.json(
		comments.map((comment) => ({
			id: comment.id,
			postId: comment.postId,
			postTitle: comment.post.title,
			postSlug: comment.post.slug,
			authorName: comment.authorName,
			authorEmail: comment.authorEmail,
			content: comment.content,
			createdAt: comment.createdAt.toISOString()
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
		await prisma.blogComment.deleteMany({ where: { id: { in: ids } } });
	}

	return Response.json({ success: true });
}
