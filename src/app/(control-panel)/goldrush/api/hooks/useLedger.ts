import { useQuery } from '@tanstack/react-query';
import { goldrushApi } from '../goldrushApiService';

export const ledgerQueryKey = ['goldrush', 'ledger'];

export const useLedger = () => {
	return useQuery({
		queryFn: () => goldrushApi.getLedger(),
		queryKey: ledgerQueryKey
	});
};
