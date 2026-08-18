import { badRequest, notFound, requireAdmin, unauthorized } from '@/lib/admin-auth';
import { bookRevShare, serializeCommission } from '@/lib/affiliates';

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: Request, context: RouteContext) {
	const session = await requireAdmin();

	if (!session) {
		return unauthorized();
	}

	const { id } = await context.params;

	try {
		const commission = await bookRevShare(id);
		return Response.json(serializeCommission(commission));
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Could not book rev share';

		if (message === 'Partner not found') {
			return notFound(message);
		}

		return badRequest(message);
	}
}
