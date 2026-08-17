import { api } from '@/utils/api';
import { HTTPError } from 'ky';
import type {
	BlogComment,
	BlogPost,
	DashboardStats,
	GameReview,
	GameStat,
	InboxMessage,
	LedgerItem,
	Player,
	Subscriber,
	SuccessStory
} from './types';

async function unwrap<T>(request: Promise<T>) {
	try {
		return await request;
	} catch (error) {
		if (error instanceof HTTPError) {
			const body = (await error.response.json().catch(() => null)) as { error?: string } | null;
			throw new Error(body?.error || error.message);
		}

		throw error;
	}
}

export const goldrushApi = {
	getStats: () => unwrap(api.get('goldrush/stats').json<DashboardStats>()),
	getPlayers: () => unwrap(api.get('goldrush/users').json<Player[]>()),
	getPlayer: (id: string) => unwrap(api.get(`goldrush/users/${id}`).json<Player>()),
	updatePlayer: (id: string, data: Partial<Player>) =>
		unwrap(api.patch(`goldrush/users/${id}`, { json: data }).json<Player>()),
	adjustWallet: (id: string, type: 'deposit' | 'withdraw', amount: number) =>
		unwrap(api.post(`goldrush/users/${id}/wallet`, { json: { type, amount } }).json<Player>()),
	resetPassword: (id: string, password: string) =>
		unwrap(api.post(`goldrush/users/${id}/password`, { json: { password } }).json<{ success: boolean }>()),
	getLedger: (params?: { kind?: string; userId?: string }) => {
		const search = new URLSearchParams();
		if (params?.kind) search.set('kind', params.kind);
		if (params?.userId) search.set('userId', params.userId);
		const suffix = search.toString() ? `?${search.toString()}` : '';
		return unwrap(api.get(`goldrush/ledger${suffix}`).json<LedgerItem[]>());
	},
	getBlogs: () => unwrap(api.get('goldrush/blogs').json<BlogPost[]>()),
	getBlog: (id: string) => unwrap(api.get(`goldrush/blogs/${id}`).json<BlogPost>()),
	createBlog: (data: Partial<BlogPost>) => unwrap(api.post('goldrush/blogs', { json: data }).json<BlogPost>()),
	updateBlog: (id: string, data: Partial<BlogPost>) =>
		unwrap(api.put(`goldrush/blogs/${id}`, { json: data }).json<BlogPost>()),
	deleteBlog: (id: string) => unwrap(api.delete(`goldrush/blogs/${id}`).json<{ success: boolean }>()),
	getComments: () => unwrap(api.get('goldrush/comments').json<BlogComment[]>()),
	deleteComments: (ids: string[]) =>
		unwrap(api.delete('goldrush/comments', { json: { ids } }).json<{ success: boolean }>()),
	getReviews: () => unwrap(api.get('goldrush/reviews').json<GameReview[]>()),
	deleteReviews: (ids: string[]) =>
		unwrap(api.delete('goldrush/reviews', { json: { ids } }).json<{ success: boolean }>()),
	deleteReply: (id: string) => unwrap(api.delete(`goldrush/replies/${id}`).json<{ success: boolean }>()),
	getStories: () => unwrap(api.get('goldrush/stories').json<SuccessStory[]>()),
	getStory: (id: string) => unwrap(api.get(`goldrush/stories/${id}`).json<SuccessStory>()),
	createStory: (data: Partial<SuccessStory>) =>
		unwrap(api.post('goldrush/stories', { json: data }).json<SuccessStory>()),
	updateStory: (id: string, data: Partial<SuccessStory>) =>
		unwrap(api.put(`goldrush/stories/${id}`, { json: data }).json<SuccessStory>()),
	deleteStory: (id: string) => unwrap(api.delete(`goldrush/stories/${id}`).json<{ success: boolean }>()),
	getInbox: () => unwrap(api.get('goldrush/inbox').json<InboxMessage[]>()),
	updateInbox: (id: string, read: boolean) =>
		unwrap(api.patch(`goldrush/inbox/${id}`, { json: { read } }).json<InboxMessage>()),
	deleteInbox: (id: string) => unwrap(api.delete(`goldrush/inbox/${id}`).json<{ success: boolean }>()),
	getSubscribers: () => unwrap(api.get('goldrush/subscribers').json<Subscriber[]>()),
	deleteSubscribers: (ids: string[]) =>
		unwrap(api.delete('goldrush/subscribers', { json: { ids } }).json<{ success: boolean }>()),
	getGames: () => unwrap(api.get('goldrush/games').json<GameStat[]>())
};
