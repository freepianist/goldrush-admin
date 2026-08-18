import fs from 'fs';
import path from 'path';
import { requireAdmin, unauthorized } from '@/lib/admin-auth';
import { resolvePublicAsset } from '@/lib/public-site';

const CONTENT_TYPES: Record<string, string> = {
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.png': 'image/png',
	'.webp': 'image/webp',
	'.gif': 'image/gif'
};

export async function GET(request: Request) {
	const session = await requireAdmin();

	if (!session) {
		return unauthorized();
	}

	const assetPath = new URL(request.url).searchParams.get('path') || '';
	const absolute = resolvePublicAsset(assetPath);

	if (!absolute) {
		return new Response('Not found', { status: 404 });
	}

	const file = fs.readFileSync(absolute);
	const type = CONTENT_TYPES[path.extname(absolute).toLowerCase()] || 'application/octet-stream';

	return new Response(file, {
		headers: {
			'Content-Type': type,
			'Cache-Control': 'public, max-age=31536000, immutable'
		}
	});
}
