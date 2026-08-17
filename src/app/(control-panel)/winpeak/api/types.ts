export type PlayerStatus = 'ACTIVE' | 'SUSPENDED';

export type Player = {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	displayName: string;
	scorpioPlayerCode: number | null;
	status: PlayerStatus;
	notes: string;
	createdAt: string;
	updatedAt: string;
	balance: number;
	currency: string;
	ledgerCount: number;
	reviewCount: number;
	ledger?: LedgerItem[];
};

export type LedgerKind = 'BET' | 'WIN' | 'CANCEL' | 'DEPOSIT' | 'WITHDRAW';

export type LedgerItem = {
	id: string;
	userId: string;
	playerName: string;
	playerEmail: string;
	providerTxId: string | null;
	referenceId: string | null;
	roundId: string | null;
	kind: LedgerKind;
	amount: number;
	balanceAfter: number;
	providerId: number | null;
	gameCode: string | null;
	createdAt: string;
};

export type BlogPost = {
	id: string;
	slug: string;
	title: string;
	excerpt: string;
	image: string;
	tag: string;
	author: string;
	authorImage: string;
	publishedAt: string;
	intro: string;
	sectionsJson: string;
	commentCount: number;
};

export type BlogComment = {
	id: string;
	postId: string;
	postTitle: string;
	postSlug: string;
	authorName: string;
	authorEmail: string;
	content: string;
	createdAt: string;
};

export type ReviewReply = {
	id: string;
	authorName: string;
	content: string;
	createdAt: string;
};

export type GameReview = {
	id: string;
	providerId: number;
	gameCode: string;
	userId: string | null;
	playerName: string;
	authorName: string;
	authorEmail: string;
	rating: number;
	content: string;
	createdAt: string;
	replyCount: number;
	replies: ReviewReply[];
};

export type SuccessStory = {
	id: string;
	authorName: string;
	role: string;
	content: string;
	image: string;
	rating: number;
	createdAt: string;
};

export type InboxMessage = {
	id: string;
	name: string;
	email: string;
	phone: string;
	message: string;
	read: boolean;
	createdAt: string;
};

export type Subscriber = {
	id: string;
	email: string;
	createdAt: string;
};

export type GameStat = {
	providerId: number | null;
	gameCode: string;
	bets: number;
	wins: number;
	rounds: number;
	reviews: number;
	avgRating: number;
	ggr: number;
};

export type DashboardStats = {
	users: { total: number; newThisWeek: number; suspended: number };
	wallets: { totalBalance: number; currency: string };
	ledger: {
		deposits: number;
		withdrawals: number;
		bets: number;
		wins: number;
		netDeposits: number;
		ggr: number;
		counts: { deposits: number; withdrawals: number; bets: number; wins: number };
	};
	content: {
		posts: number;
		comments: number;
		reviews: number;
		stories: number;
		unreadInbox: number;
		subscribers: number;
	};
	series: { date: string; deposits: number; withdrawals: number; bets: number; wins: number }[];
	recentUsers: Player[];
	recentLedger: LedgerItem[];
};
