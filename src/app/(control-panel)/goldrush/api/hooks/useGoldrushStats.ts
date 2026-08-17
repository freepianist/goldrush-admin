import { useQuery } from '@tanstack/react-query';
import { goldrushApi } from '../goldrushApiService';

export const statsQueryKey = ['goldrush', 'stats'];

export const useGoldrushStats = () => {
	return useQuery({
		queryFn: goldrushApi.getStats,
		queryKey: statsQueryKey
	});
};
