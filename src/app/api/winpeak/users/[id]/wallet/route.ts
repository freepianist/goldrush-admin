import { badRequest, notFound, requireAdmin, unauthorized } from '@/lib/admin-auth';
import { getPlayerOrThrow, serializeUser } from '@/lib/serializers';
import { applyDeposit, applyWithdraw } from '@/lib/wallet';

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
	const session = await requireAdmin();

	if (!session) {
		return unauthorized();
	}

	const { id } = await context.params;
	const user = await getPlayerOrThrow(id);

	if (!user) {
		return notFound('Player not found');
	}

	const body = (await request.json()) as { type?: string; amount?: number };
	const amount = Number(body.amount);

	if (!Number.isFinite(amount) || amount <= 0) {
		return badRequest('Enter a valid amount');
	}

	try {
		if (body.type === 'deposit') {
			await applyDeposit(id, amount);
		} else if (body.type === 'withdraw') {
			await applyWithdraw(id, amount);
		} else {
			return badRequest('Type must be deposit or withdraw');
		}
	} catch (error) {
		return badRequest(error instanceof Error ? error.message : 'Wallet update failed');
	}

	const updated = await getPlayerOrThrow(id);

	return Response.json(serializeUser(updated));
}
