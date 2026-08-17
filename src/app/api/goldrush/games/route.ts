import { prisma } from '@/lib/db';
import { money } from '@/lib/money';
import { requireAdmin, unauthorized } from '@/lib/admin-auth';

export async function GET() {
	const session = await requireAdmin();

	if (!session) {
		return unauthorized();
	}

	const [entries, reviews] = await Promise.all([
		prisma.ledgerEntry.findMany({
			where: { gameCode: { not: null } },
			select: { providerId: true, gameCode: true, kind: true, amount: true }
		}),
		prisma.gameReview.groupBy({
			by: ['providerId', 'gameCode'],
			_count: true,
			_avg: { rating: true }
		})
	]);

	const games = new Map<
		string,
		{
			providerId: number | null;
			gameCode: string;
			bets: number;
			wins: number;
			rounds: number;
			reviews: number;
			avgRating: number;
		}
	>();

	for (const entry of entries) {
		const gameCode = entry.gameCode || '';
		const key = `${entry.providerId || 0}:${gameCode}`;
		const current = games.get(key) || {
			providerId: entry.providerId,
			gameCode,
			bets: 0,
			wins: 0,
			rounds: 0,
			reviews: 0,
			avgRating: 0
		};

		if (entry.kind === 'BET') {
			current.bets += money(entry.amount);
			current.rounds += 1;
		}

		if (entry.kind === 'WIN') {
			current.wins += money(entry.amount);
		}

		games.set(key, current);
	}

	for (const review of reviews) {
		const key = `${review.providerId}:${review.gameCode}`;
		const current = games.get(key) || {
			providerId: review.providerId,
			gameCode: review.gameCode,
			bets: 0,
			wins: 0,
			rounds: 0,
			reviews: 0,
			avgRating: 0
		};
		current.reviews = review._count;
		current.avgRating = Number(review._avg.rating || 0);
		games.set(key, current);
	}

	return Response.json(
		Array.from(games.values())
			.map((game) => ({
				...game,
				ggr: game.bets - game.wins
			}))
			.sort((a, b) => b.bets - a.bets)
	);
}
