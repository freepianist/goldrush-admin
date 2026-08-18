import type { Metadata } from 'next';
import { normalizeSiteUrl } from '@/lib/env';

async function generateMetadata(meta: {
	title: string;
	description: string;
	cardImage: string;
	robots: string;
	favicon: string;
	url: string;
}): Promise<Metadata> {
	const siteUrl = normalizeSiteUrl(meta.url);

	return {
		title: meta.title,
		description: meta.description,
		referrer: 'origin-when-cross-origin',
		keywords: ['FuseTech', 'fdk', 'fdk react', 'saas'],
		authors: [{ name: 'Vercel', url: 'https://vercel.com/' }],
		creator: 'FuseTech',
		publisher: 'FuseTech',
		robots: meta.robots,
		icons: { icon: meta.favicon },
		metadataBase: new URL(siteUrl),
		openGraph: {
			url: siteUrl,
			title: meta.title,
			description: meta.description,
			images: [meta.cardImage],
			type: 'website',
			siteName: meta.title
		},
		twitter: {
			card: 'summary_large_image',
			site: '@FuseTech',
			creator: '@FuseTech',
			title: meta.title,
			description: meta.description,
			images: [meta.cardImage]
		}
	};
}

export default generateMetadata;
