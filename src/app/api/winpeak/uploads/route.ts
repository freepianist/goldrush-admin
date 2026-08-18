import { badRequest, requireAdmin, unauthorized } from '@/lib/admin-auth';
import { savePublicUpload } from '@/lib/public-site';

export async function POST(request: Request) {
	const session = await requireAdmin();

	if (!session) {
		return unauthorized();
	}

	const formData = await request.formData();
	const file = formData.get('file');
	const folder = String(formData.get('folder') || 'blog');

	if (!(file instanceof File)) {
		return badRequest('An image file is required');
	}

	try {
		const url = await savePublicUpload(file, folder);
		return Response.json({ url });
	} catch (error) {
		return badRequest(error instanceof Error ? error.message : 'Could not upload image');
	}
}
