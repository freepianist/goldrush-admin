import { useQuery } from '@tanstack/react-query';
import { winpeakApi } from '../apiService';

export const statsQueryKey = ['winpeak', 'stats'];

export const useWinPeakStats = () => {
	return useQuery({
		queryFn: winpeakApi.getStats,
		queryKey: statsQueryKey
	});
};
