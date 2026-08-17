import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { goldrushApi } from '../goldrushApiService';
import { statsQueryKey } from './useGoldrushStats';
import type { Player } from '../types';

export const playersQueryKey = ['goldrush', 'players'];
export const playerQueryKey = (id: string) => ['goldrush', 'players', id];

export const usePlayers = () => {
	return useQuery({
		queryFn: goldrushApi.getPlayers,
		queryKey: playersQueryKey
	});
};

export const usePlayer = (id: string) => {
	return useQuery({
		queryFn: () => goldrushApi.getPlayer(id),
		queryKey: playerQueryKey(id),
		enabled: Boolean(id) && id !== 'new'
	});
};

export const useUpdatePlayer = (id: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: Partial<Player>) => goldrushApi.updatePlayer(id, data),
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
			goldrushApi.adjustWallet(id, type, amount),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: playersQueryKey });
			queryClient.invalidateQueries({ queryKey: playerQueryKey(id) });
			queryClient.invalidateQueries({ queryKey: ['goldrush', 'ledger'] });
			queryClient.invalidateQueries({ queryKey: statsQueryKey });
		}
	});
};

export const useResetPassword = (id: string) => {
	return useMutation({
		mutationFn: (password: string) => goldrushApi.resetPassword(id, password)
	});
};
