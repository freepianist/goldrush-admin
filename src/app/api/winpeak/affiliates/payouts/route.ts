import { prisma } from '@/lib/db';
import { badRequest, requireAdmin, requireAdminOrAffiliate, unauthorized } from '@/lib/admin-auth';
import { serializePayout } from '@/lib/affiliates';

export async function GET() {
	const access = await requireAdminOrAffiliate();

	if (!access) {
		return unauthorized();
	}

	const payouts = await prisma.affiliatePayout.findMany({
		where: access.isAdmin ? undefined : { partnerId: access.partner.id },
		orderBy: { createdAt: 'desc' },
		include: { partner: { select: { name: true, email: true, code: true } } }
	});

	return Response.json(payouts.map(serializePayout));
}

export async function POST(request: Request) {
	const session = await requireAdmin();

	if (!session) {
		return unauthorized();
	}

	const body = (await request.json()) as {
		partnerId?: string;
		amount?: number | string;
		note?: string;
		status?: string;
	};

	const partnerId = String(body.partnerId || '');
	const amount = Number(body.amount);

	if (!partnerId) {
		return badRequest('Partner is required');
	}

	if (!Number.isFinite(amount) || amount <= 0) {
		return badRequest('Enter a valid payout amount');
	}

	const partner = await prisma.affiliatePartner.findUnique({ where: { id: partnerId } });

	if (!partner) {
		return badRequest('Partner not found');
	}

	const payout = await prisma.affiliatePayout.create({
		data: {
			partnerId,
			amount,
			note: String(body.note || '').trim() || null,
			status: body.status === 'SENT' ? 'SENT' : 'PENDING'
		},
		include: { partner: { select: { name: true, email: true, code: true } } }
	});

	return Response.json(serializePayout(payout));
}
