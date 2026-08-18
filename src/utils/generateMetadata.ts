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
		keywords: ['WinPeak', 'admin', 'operations'],
		authors: [{ name: 'WinPeak' }],
		creator: 'WinPeak',
		publisher: 'WinPeak',
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
			site: '@WinPeak',
			creator: '@WinPeak',
			title: meta.title,
			description: meta.description,
			images: [meta.cardImage]
		}
	};
}

export default generateMetadata;
