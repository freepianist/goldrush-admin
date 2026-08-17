import i18n from '@i18n';
import { FuseNavItemType } from '@fuse/core/FuseNavigation/types/FuseNavItemType';
import ar from './navigation-i18n/ar';
import en from './navigation-i18n/en';
import tr from './navigation-i18n/tr';

i18n.addResourceBundle('en', 'navigation', en);
i18n.addResourceBundle('tr', 'navigation', tr);
i18n.addResourceBundle('ar', 'navigation', ar);

const navigationConfig: FuseNavItemType[] = [
	{
		id: 'dashboards',
		title: 'Dashboards',
		subtitle: 'Live Goldrush operations',
		type: 'group',
		icon: 'lucide:layout-dashboard',
		children: [
			{
				id: 'dashboards.goldrush',
				title: 'Overview',
				type: 'item',
				icon: 'lucide:gauge',
				url: '/dashboards/goldrush'
			}
		]
	},
	{
		id: 'operations',
		title: 'Operations',
		subtitle: 'Players, money, and games',
		type: 'group',
		icon: 'lucide:briefcase',
		children: [
			{
				id: 'apps.players',
				title: 'Players',
				type: 'item',
				icon: 'lucide:users',
				url: '/apps/players'
			},
			{
				id: 'apps.ledger',
				title: 'Ledger',
				type: 'item',
				icon: 'lucide:book-open',
				url: '/apps/ledger'
			},
			{
				id: 'apps.games',
				title: 'Games',
				type: 'item',
				icon: 'lucide:gamepad-2',
				url: '/apps/games'
			}
		]
	},
	{
		id: 'content',
		title: 'Content',
		subtitle: 'What players see on Goldrush',
		type: 'group',
		icon: 'lucide:newspaper',
		children: [
			{
				id: 'apps.blog',
				title: 'Blog',
				type: 'item',
				icon: 'lucide:file-text',
				url: '/apps/blog'
			},
			{
				id: 'apps.comments',
				title: 'Comments',
				type: 'item',
				icon: 'lucide:messages-square',
				url: '/apps/comments'
			},
			{
				id: 'apps.reviews',
				title: 'Reviews',
				type: 'item',
				icon: 'lucide:star',
				url: '/apps/reviews'
			},
			{
				id: 'apps.stories',
				title: 'Stories',
				type: 'item',
				icon: 'lucide:quote',
				url: '/apps/stories'
			}
		]
	},
	{
		id: 'communications',
		title: 'Communications',
		subtitle: 'Inbox and mailing list',
		type: 'group',
		icon: 'lucide:mail',
		children: [
			{
				id: 'apps.inbox',
				title: 'Inbox',
				type: 'item',
				icon: 'lucide:inbox',
				url: '/apps/inbox'
			},
			{
				id: 'apps.subscribers',
				title: 'Subscribers',
				type: 'item',
				icon: 'lucide:mail-plus',
				url: '/apps/subscribers'
			}
		]
	}
];

export default navigationConfig;
