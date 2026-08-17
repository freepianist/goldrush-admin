import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { winpeakApi } from '../winpeakApiService';
import { statsQueryKey } from './useDashboardStats';
import type { Player } from '../types';

export const playersQueryKey = ['winpeak', 'players'];
export const playerQueryKey = (id: string) => ['winpeak', 'players', id];

export const usePlayers = () => {
	return useQuery({
		queryFn: winpeakApi.getPlayers,
		queryKey: playersQueryKey
	});
};

export const usePlayer = (id: string) => {
	return useQuery({
		queryFn: () => winpeakApi.getPlayer(id),
		queryKey: playerQueryKey(id),
		enabled: Boolean(id) && id !== 'new'
	});
};

export const useUpdatePlayer = (id: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: Partial<Player>) => winpeakApi.updatePlayer(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: playersQueryKey });
			queryClient.invalidateQueries({ queryKey: playerQueryKey(id) });
			queryClient.invalidateQueries({ queryKey: statsQueryKey });
		}
	});
};

export const useAdjustWallet = (id: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ type, amount }: { type: 'deposit' | 'withdraw'; amount: number }) =>
			winpeakApi.adjustWallet(id, type, amount),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: playersQueryKey });
			queryClient.invalidateQueries({ queryKey: playerQueryKey(id) });
			queryClient.invalidateQueries({ queryKey: ['winpeak', 'ledger'] });
			queryClient.invalidateQueries({ queryKey: statsQueryKey });
		}
	});
};

export const useResetPassword = (id: string) => {
	return useMutation({
		mutationFn: (password: string) => winpeakApi.resetPassword(id, password)
	});
};
