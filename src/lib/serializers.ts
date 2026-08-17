import { prisma } from '@/lib/db';
import { money } from '@/lib/money';

export type BlogBody = {
	intro: string[];
	sections: { heading: string; paragraphs: string[] }[];
};

export function parseBlogBody(raw: string): BlogBody {
	try {
		const parsed = JSON.parse(raw) as BlogBody;
		return {
			intro: parsed.intro || [],
			sections: parsed.sections || []
		};
	} catch {
		return { intro: raw ? [raw] : [], sections: [] };
	}
}

export function encodeBlogBody(intro: string, sectionsJson?: string) {
	let sections: BlogBody['sections'] = [];

	if (sectionsJson?.trim()) {
		try {
			const parsed = JSON.parse(sectionsJson) as BlogBody['sections'];
			if (Array.isArray(parsed)) {
				sections = parsed;
			}
		} catch {
			sections = [];
		}
	}

	return JSON.stringify({
		intro: intro
			.split(/\n\n+/)
			.map((part) => part.trim())
			.filter(Boolean),
		sections
	});
}

export function serializeUser(user: {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	scorpioPlayerCode: number | null;
	status: string;
	notes: string | null;
	createdAt: Date;
	updatedAt: Date;
	wallet?: { balance: { toString(): string } | number; currency: string } | null;
	_count?: { ledger: number; reviews: number };
}) {
	return {
		id: user.id,
		email: user.email,
		firstName: user.firstName,
		lastName: user.lastName,
		displayName: `${user.firstName} ${user.lastName}`.trim(),
		scorpioPlayerCode: user.scorpioPlayerCode,
		status: user.status,
		notes: user.notes || '',
		createdAt: user.createdAt.toISOString(),
		updatedAt: user.updatedAt.toISOString(),
		balance: money(user.wallet?.balance),
		currency: user.wallet?.currency || 'USD',
		ledgerCount: user._count?.ledger ?? 0,
		reviewCount: user._count?.reviews ?? 0
	};
}

export function serializeLedger(entry: {
	id: string;
	userId: string;
	providerTxId: string | null;
	referenceId: string | null;
	roundId: string | null;
	kind: string;
	amount: { toString(): string } | number;
	balanceAfter: { toString(): string } | number;
	providerId: number | null;
	gameCode: string | null;
	createdAt: Date;
	user?: { firstName: string; lastName: string; email: string };
}) {
	return {
		id: entry.id,
		userId: entry.userId,
		playerName: entry.user ? `${entry.user.firstName} ${entry.user.lastName}`.trim() : '',
		playerEmail: entry.user?.email || '',
		providerTxId: entry.providerTxId,
		referenceId: entry.referenceId,
		roundId: entry.roundId,
		kind: entry.kind,
		amount: money(entry.amount),
		balanceAfter: money(entry.balanceAfter),
		providerId: entry.providerId,
		gameCode: entry.gameCode,
		createdAt: entry.createdAt.toISOString()
	};
}

export async function getPlayerOrThrow(id: string) {
	const user = await prisma.user.findUnique({
		where: { id },
		include: {
			wallet: true,
			_count: { select: { ledger: true, reviews: true } }
		}
	});

	return user;
}
