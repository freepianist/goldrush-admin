import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

function readEnvFile(filePath: string) {
	if (!fs.existsSync(filePath)) {
		return;
	}

	for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
		if (!line || line.trim().startsWith('#') || !line.includes('=')) {
			continue;
		}

		const idx = line.indexOf('=');
		const key = line.slice(0, idx).trim();
		let value = line.slice(idx + 1).trim();

		if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
			value = value.slice(1, -1);
		}

		const existing = process.env[key];
		const isPlaceholder =
			!existing ||
			(key === 'DATABASE_URL' && /postgresql:\/\/localhost:5432\/goldrush/.test(existing));

		if (isPlaceholder) {
			process.env[key] = value;
		}
	}
}

function ensureDatabaseUrl() {
	const current = process.env.DATABASE_URL || '';
	const isPlaceholder = !current || /postgresql:\/\/localhost:5432\/goldrush/.test(current);

	if (!isPlaceholder) {
		return;
	}

	const goldrushRoot = path.resolve(process.cwd(), '../goldrush');
	readEnvFile(path.join(goldrushRoot, '.env'));
	readEnvFile(path.join(goldrushRoot, '.env.local'));
}

ensureDatabaseUrl();

const connectionString = process.env.DATABASE_URL;

const globalForPrisma = globalThis as unknown as {
	prisma?: PrismaClient;
	pool?: Pool;
};

function createPrisma() {
	if (!connectionString) {
		throw new Error('DATABASE_URL is not set. Copy it from goldrush/.env into goldrush-admin/.env');
	}

	const ssl =
		/\.neon\.tech/i.test(connectionString) || /sslmode=require/i.test(connectionString)
			? { rejectUnauthorized: true }
			: undefined;

	const pool =
		globalForPrisma.pool ??
		new Pool({
			connectionString,
			max: 10,
			idleTimeoutMillis: 30_000,
			ssl
		});

	if (process.env.NODE_ENV !== 'production') {
		globalForPrisma.pool = pool;
	}

	return new PrismaClient({
		adapter: new PrismaPg(pool),
		log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error']
	});
}

export const prisma = globalForPrisma.prisma ?? createPrisma();

if (process.env.NODE_ENV !== 'production') {
	globalForPrisma.prisma = prisma;
}
