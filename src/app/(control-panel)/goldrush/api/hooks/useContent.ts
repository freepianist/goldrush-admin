import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { goldrushApi } from '../goldrushApiService';
import { statsQueryKey } from './useGoldrushStats';

export const commentsQueryKey = ['goldrush', 'comments'];
export const reviewsQueryKey = ['goldrush', 'reviews'];
export const storiesQueryKey = ['goldrush', 'stories'];
export const storyQueryKey = (id: string) => ['goldrush', 'stories', id];
export const inboxQueryKey = ['goldrush', 'inbox'];
export const subscribersQueryKey = ['goldrush', 'subscribers'];
export const gamesQueryKey = ['goldrush', 'games'];

export const useComments = () => useQuery({ queryFn: goldrushApi.getComments, queryKey: commentsQueryKey });
export const useReviews = () => useQuery({ queryFn: goldrushApi.getReviews, queryKey: reviewsQueryKey });
export const useStories = () => useQuery({ queryFn: goldrushApi.getStories, queryKey: storiesQueryKey });
export const useStory = (id: string) =>
	useQuery({
		queryFn: () => goldrushApi.getStory(id),
		queryKey: storyQueryKey(id),
		enabled: Boolean(id) && id !== 'new'
	});
export const useInbox = () => useQuery({ queryFn: goldrushApi.getInbox, queryKey: inboxQueryKey });
export const useSubscribers = () =>
	useQuery({ queryFn: goldrushApi.getSubscribers, queryKey: subscribersQueryKey });
export const useGames = () => useQuery({ queryFn: goldrushApi.getGames, queryKey: gamesQueryKey });

export const useDeleteComments = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: goldrushApi.deleteComments,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: commentsQueryKey });
			queryClient.invalidateQueries({ queryKey: statsQueryKey });
		}
	});
};

export const useDeleteReviews = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: goldrushApi.deleteReviews,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: reviewsQueryKey });
			queryClient.invalidateQueries({ queryKey: statsQueryKey });
		}
	});
};

export const useDeleteReply = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: goldrushApi.deleteReply,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: reviewsQueryKey })
	});
};

export const useCreateStory = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: goldrushApi.createStory,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: storiesQueryKey });
			queryClient.invalidateQueries({ queryKey: statsQueryKey });
		}
	});
};

export const useUpdateStory = (id: string) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: Parameters<typeof goldrushApi.updateStory>[1]) => goldrushApi.updateStory(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: storiesQueryKey });
			queryClient.invalidateQueries({ queryKey: storyQueryKey(id) });
		}
	});
};

export const useDeleteStory = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: goldrushApi.deleteStory,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: storiesQueryKey });
			queryClient.invalidateQueries({ queryKey: statsQueryKey });
		}
	});
};

export const useUpdateInbox = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, read }: { id: string; read: boolean }) => goldrushApi.updateInbox(id, read),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: inboxQueryKey });
			queryClient.invalidateQueries({ queryKey: statsQueryKey });
		}
	});
};

export const useDeleteInbox = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: goldrushApi.deleteInbox,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: inboxQueryKey });
			queryClient.invalidateQueries({ queryKey: statsQueryKey });
		}
	});
};

export const useDeleteSubscribers = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: goldrushApi.deleteSubscribers,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: subscribersQueryKey });
			queryClient.invalidateQueries({ queryKey: statsQueryKey });
		}
	});
};
