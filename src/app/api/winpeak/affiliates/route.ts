import { prisma } from '@/lib/db';
import { badRequest, requireAdmin, unauthorized } from '@/lib/admin-auth';
import {
	getPartnerBook,
	hashAffiliatePassword,
	makeAffiliateCode,
	makeTempPassword,
	serializePartner
} from '@/lib/affiliates';

const DEAL_TYPES = new Set(['CPA', 'REVSHARE', 'HYBRID']);

export async function GET() {
	const session = await requireAdmin();

	if (!session) {
		return unauthorized();
	}

	const partners = await prisma.affiliatePartner.findMany({
		orderBy: { createdAt: 'desc' }
	});

	const rows = await Promise.all(
		partners.map(async (partner) => {
			const book = await getPartnerBook(partner.id);
			return serializePartner(partner, { stats: book?.stats });
		})
	);

	return Response.json(rows);
}

export async function POST(request: Request) {
	const session = await requireAdmin();

	if (!session) {
		return unauthorized();
	}

	const body = (await request.json()) as {
		name?: string;
		email?: string;
		dealType?: string;
		cpaAmount?: number | string;
		revSharePercent?: number | string;
		notes?: string;
		password?: string;
		code?: string;
	};

	const name = String(body.name || '').trim();
	const email = String(body.email || '').trim().toLowerCase();
	const dealType = String(body.dealType || '').toUpperCase();

	if (!name || !email) {
		return badRequest('Name and email are required');
	}

	if (!DEAL_TYPES.has(dealType)) {
		return badRequest('Deal type must be CPA, REVSHARE, or HYBRID');
	}

	const existing = await prisma.affiliatePartner.findUnique({ where: { email } });

	if (existing) {
		return badRequest('A partner with this email already exists');
	}

	let code = String(body.code || makeAffiliateCode(name)).trim().toUpperCase();

	while (await prisma.affiliatePartner.findUnique({ where: { code } })) {
		code = makeAffiliateCode(name);
	}

	const password = String(body.password || '').trim() || makeTempPassword();
	const cpaAmount = dealType === 'REVSHARE' ? null : Number(body.cpaAmount || 0);
	const revSharePercent = dealType === 'CPA' ? null : Number(body.revSharePercent || 0);

	if (dealType !== 'REVSHARE' && (!Number.isFinite(cpaAmount) || (cpaAmount as number) < 0)) {
		return badRequest('Enter a valid CPA amount');
	}

	if (dealType !== 'CPA' && (!Number.isFinite(revSharePercent) || (revSharePercent as number) < 0)) {
		return badRequest('Enter a valid rev share percent');
	}

	const partner = await prisma.affiliatePartner.create({
		data: {
			name,
			email,
			code,
			dealType: dealType as 'CPA' | 'REVSHARE' | 'HYBRID',
			cpaAmount,
			revSharePercent,
			notes: String(body.notes || '').trim() || null,
			passwordHash: await hashAffiliatePassword(password),
			status: 'ACTIVE'
		}
	});

	return Response.json({
		...serializePartner(partner),
		temporaryPassword: password
	});
}
