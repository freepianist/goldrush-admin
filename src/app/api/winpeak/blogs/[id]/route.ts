import { prisma } from '@/lib/db';
import { badRequest, notFound, requireAdmin, unauthorized } from '@/lib/admin-auth';
import { encodeBlogBody, parseBlogBody } from '@/lib/serializers';
import { slugify } from '@/lib/money';

type RouteContext = { params: Promise<{ id: string }> };

function serializePost(post: {
	id: string;
	slug: string;
	title: string;
	excerpt: string;
	body: string;
	image: string;
	tag: string;
	author: string;
	authorImage: string;
	publishedAt: Date;
	_count?: { comments: number };
}) {
	const body = parseBlogBody(post.body);

	return {
		id: post.id,
		slug: post.slug,
		title: post.title,
		excerpt: post.excerpt,
		image: post.image,
		tag: post.tag,
		author: post.author,
		authorImage: post.authorImage,
		publishedAt: post.publishedAt.toISOString(),
		intro: body.intro.join('\n\n'),
		sectionsJson: JSON.stringify(body.sections, null, 2),
		commentCount: post._count?.comments ?? 0
	};
}

export async function GET(_request: Request, context: RouteContext) {
	const session = await requireAdmin();

	if (!session) {
		return unauthorized();
	}

	const { id } = await context.params;
	const post = await prisma.blogPost.findUnique({
		where: { id },
		include: { _count: { select: { comments: true } } }
	});

	if (!post) {
		return notFound('Post not found');
	}

	return Response.json(serializePost(post));
}

export async function PUT(request: Request, context: RouteContext) {
	const session = await requireAdmin();

	if (!session) {
		return unauthorized();
	}

	const { id } = await context.params;
	const existing = await prisma.blogPost.findUnique({ where: { id } });

	if (!existing) {
		return notFound('Post not found');
	}

	const body = (await request.json()) as {
		title?: string;
		slug?: string;
		excerpt?: string;
		intro?: string;
		image?: string;
		tag?: string;
		author?: string;
		authorImage?: string;
	};

	const title = body.title?.trim();

	if (!title) {
		return badRequest('Title is required');
	}

	const slug = slugify(body.slug || title);

	if (slug !== existing.slug) {
		const clash = await prisma.blogPost.findUnique({ where: { slug } });

		if (clash) {
			return badRequest('A post with that slug already exists');
		}
	}

	const post = await prisma.blogPost.update({
		where: { id },
		data: {
			title,
			slug,
			excerpt: body.excerpt?.trim() || '',
			body: encodeBlogBody(body.intro || '', JSON.stringify(parseBlogBody(existing.body).sections)),
			image: body.image?.trim() || existing.image,
			tag: body.tag?.trim() || existing.tag,
			author: body.author?.trim() || existing.author,
			authorImage: body.authorImage?.trim() || existing.authorImage
		},
		include: { _count: { select: { comments: true } } }
	});

	return Response.json(serializePost(post));
}

export async function DELETE(_request: Request, context: RouteContext) {
	const session = await requireAdmin();

	if (!session) {
		return unauthorized();
	}

	const { id } = await context.params;

	await prisma.blogPost.delete({ where: { id } }).catch(() => null);

	return Response.json({ success: true });
}
