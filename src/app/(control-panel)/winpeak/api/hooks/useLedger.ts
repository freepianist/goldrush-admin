import { useQuery } from '@tanstack/react-query';
import { winpeakApi } from '../winpeakApiService';

export const ledgerQueryKey = ['winpeak', 'ledger'];

export const useLedger = () => {
	return useQuery({
		queryFn: () => winpeakApi.getLedger(),
		queryKey: ledgerQueryKey
	});
};
