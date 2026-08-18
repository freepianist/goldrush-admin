import { prisma } from '@/lib/db';
import { requireAdminOrAffiliate, unauthorized } from '@/lib/admin-auth';
import { serializeCommission } from '@/lib/affiliates';

export async function GET() {
	const access = await requireAdminOrAffiliate();

	if (!access) {
		return unauthorized();
	}

	const commissions = await prisma.affiliateCommission.findMany({
		where: access.isAdmin ? undefined : { partnerId: access.partner.id },
		orderBy: { createdAt: 'desc' },
		include: {
			partner: { select: { name: true, email: true, code: true } },
			user: { select: { firstName: true, lastName: true, email: true } }
		}
	});

	return Response.json(
		commissions.map((row) => serializeCommission({ ...row, maskPlayer: !access.isAdmin }))
	);
}
