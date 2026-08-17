import { prisma } from '@/lib/db';
import { badRequest, requireAdmin, unauthorized } from '@/lib/admin-auth';

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

export async function GET() {
	const session = await requireAdmin();

	if (!session) {
		return unauthorized();
	}

	const stories = await prisma.successStory.findMany({
		orderBy: { createdAt: 'desc' }
	});

	return Response.json(stories.map(serializeStory));
}

export async function POST(request: Request) {
	const session = await requireAdmin();

	if (!session) {
		return unauthorized();
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

	const rating = Math.min(5, Math.max(1, Number(body.rating) || 5));

	const story = await prisma.successStory.create({
		data: {
			authorName: body.authorName.trim(),
			role: body.role?.trim() || 'Player',
			content: body.content.trim(),
			image: body.image?.trim() || '/images/avatar/one.png',
			rating
		}
	});

	return Response.json(serializeStory(story), { status: 201 });
}
