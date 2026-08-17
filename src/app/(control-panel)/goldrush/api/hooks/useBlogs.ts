import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { goldrushApi } from '../goldrushApiService';
import { statsQueryKey } from './useGoldrushStats';
import type { BlogPost } from '../types';

export const blogsQueryKey = ['goldrush', 'blogs'];
export const blogQueryKey = (id: string) => ['goldrush', 'blogs', id];

export const useBlogs = () => {
	return useQuery({
		queryFn: goldrushApi.getBlogs,
		queryKey: blogsQueryKey
	});
};

export const useBlog = (id: string) => {
	return useQuery({
		queryFn: () => goldrushApi.getBlog(id),
		queryKey: blogQueryKey(id),
		enabled: Boolean(id) && id !== 'new'
	});
};

export const useCreateBlog = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: Partial<BlogPost>) => goldrushApi.createBlog(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: blogsQueryKey });
			queryClient.invalidateQueries({ queryKey: statsQueryKey });
		}
	});
};

export const useUpdateBlog = (id: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: Partial<BlogPost>) => goldrushApi.updateBlog(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: blogsQueryKey });
			queryClient.invalidateQueries({ queryKey: blogQueryKey(id) });
		}
	});
};

export const useDeleteBlog = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => goldrushApi.deleteBlog(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: blogsQueryKey });
			queryClient.invalidateQueries({ queryKey: statsQueryKey });
		}
	});
};
