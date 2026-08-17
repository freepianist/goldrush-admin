import { prisma } from '@/lib/db';
import { badRequest, requireAdmin, unauthorized } from '@/lib/admin-auth';
import { encodeBlogBody, parseBlogBody } from '@/lib/serializers';
import { slugify } from '@/lib/money';

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

export async function GET() {
	const session = await requireAdmin();

	if (!session) {
		return unauthorized();
	}

	const posts = await prisma.blogPost.findMany({
		orderBy: { publishedAt: 'desc' },
		include: { _count: { select: { comments: true } } }
	});

	return Response.json(posts.map(serializePost));
}

export async function POST(request: Request) {
	const session = await requireAdmin();

	if (!session) {
		return unauthorized();
	}

	const body = (await request.json()) as {
		title?: string;
		slug?: string;
		excerpt?: string;
		intro?: string;
		sectionsJson?: string;
		image?: string;
		tag?: string;
		author?: string;
		authorImage?: string;
		publishedAt?: string;
	};

	const title = body.title?.trim();

	if (!title) {
		return badRequest('Title is required');
	}

	const slug = slugify(body.slug || title);

	if (!slug) {
		return badRequest('A valid slug is required');
	}

	const existing = await prisma.blogPost.findUnique({ where: { slug } });

	if (existing) {
		return badRequest('A post with that slug already exists');
	}

	const post = await prisma.blogPost.create({
		data: {
			title,
			slug,
			excerpt: body.excerpt?.trim() || '',
			body: encodeBlogBody(body.intro || '', body.sectionsJson),
			image: body.image?.trim() || '/images/blog/one.png',
			tag: body.tag?.trim() || 'News',
			author: body.author?.trim() || 'WinPeak Desk',
			authorImage: body.authorImage?.trim() || '/images/avatar/five.png',
			publishedAt: body.publishedAt ? new Date(body.publishedAt) : new Date()
		},
		include: { _count: { select: { comments: true } } }
	});

	return Response.json(serializePost(post), { status: 201 });
}
