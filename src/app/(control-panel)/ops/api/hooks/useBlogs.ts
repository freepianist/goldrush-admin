import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { winpeakApi } from '../apiService';
import { statsQueryKey } from './useWinPeakStats';
import type { BlogPost } from '../types';

export const blogsQueryKey = ['winpeak', 'blogs'];
export const blogQueryKey = (id: string) => ['winpeak', 'blogs', id];

export const useBlogs = () => {
	return useQuery({
		queryFn: winpeakApi.getBlogs,
		queryKey: blogsQueryKey
	});
};

export const useBlog = (id: string) => {
	return useQuery({
		queryFn: () => winpeakApi.getBlog(id),
		queryKey: blogQueryKey(id),
		enabled: Boolean(id) && id !== 'new'
	});
};

export const useCreateBlog = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: Partial<BlogPost>) => winpeakApi.createBlog(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: blogsQueryKey });
			queryClient.invalidateQueries({ queryKey: statsQueryKey });
		}
	});
};

export const useUpdateBlog = (id: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: Partial<BlogPost>) => winpeakApi.updateBlog(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: blogsQueryKey });
			queryClient.invalidateQueries({ queryKey: blogQueryKey(id) });
		}
	});
};

export const useDeleteBlog = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => winpeakApi.deleteBlog(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: blogsQueryKey });
			queryClient.invalidateQueries({ queryKey: statsQueryKey });
		}
	});
};
