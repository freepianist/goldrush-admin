import { useQuery } from '@tanstack/react-query';
import { winpeakApi } from '../winpeakApiService';

export const statsQueryKey = ['winpeak', 'stats'];

export const useDashboardStats = () => {
	return useQuery({
		queryFn: winpeakApi.getStats,
		queryKey: statsQueryKey
	});
};
