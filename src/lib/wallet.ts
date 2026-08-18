import type { Prisma } from '@/generated/prisma';
import { prisma } from '@/lib/db';
import { money } from '@/lib/money';
import { accrueAffiliateCpa } from '@/lib/affiliates';

export async function applyDeposit(userId: string, amount: number) {
	if (amount <= 0) {
		throw new Error('Deposit amount must be greater than 0');
	}

	const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
		const wallet = await tx.wallet.findUnique({ where: { userId } });

		if (!wallet) {
			throw new Error('Wallet not found');
		}

		const next = money(wallet.balance) + amount;
		await tx.wallet.update({
			where: { userId },
			data: { balance: next }
		});
		await tx.ledgerEntry.create({
			data: {
				userId,
				kind: 'DEPOSIT',
				amount,
				balanceAfter: next
			}
		});

		return { balance: next, currency: wallet.currency };
	});

	try {
		await accrueAffiliateCpa(userId, amount);
	} catch (error) {
		console.error('Affiliate CPA accrual failed', error);
	}

	return result;
}

export async function applyWithdraw(userId: string, amount: number) {
	if (amount <= 0) {
		throw new Error('Withdraw amount must be greater than 0');
	}

	return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
		const wallet = await tx.wallet.findUnique({ where: { userId } });

		if (!wallet) {
			throw new Error('Wallet not found');
		}

		if (money(wallet.balance) < amount) {
			throw new Error('Insufficient balance');
		}

		const next = money(wallet.balance) - amount;
		await tx.wallet.update({
			where: { userId },
			data: { balance: next }
		});
		await tx.ledgerEntry.create({
			data: {
				userId,
				kind: 'WITHDRAW',
				amount,
				balanceAfter: next
			}
		});

		return { balance: next, currency: wallet.currency };
	});
}
