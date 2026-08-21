'use client';

import { useMemo } from 'react';
import { type MRT_ColumnDef } from 'material-react-table';
import DataTable from 'src/components/data-table/DataTable';
import FuseLoading from '@fuse/core/FuseLoading';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Link from '@fuse/core/Link';
import { format } from 'date-fns';
import { enqueueSnackbar } from 'notistack';
import AdminPageHeader from '@/app/(control-panel)/ops/components/AdminPageHeader';
import { useUpdateWalletRequest, useWalletRequests } from '@/app/(control-panel)/ops/api/hooks/usePlayers';
import type { WalletRequest } from '@/app/(control-panel)/ops/api/types';
import { formatMoney } from '@/lib/money';

const Root = styled(FusePageCarded)(() => ({
	'& .container': {
		maxWidth: '100%!important'
	}
}));

function WalletRequestsView() {
	const { data: requests = [], isLoading } = useWalletRequests();
	const update = useUpdateWalletRequest();

	const columns = useMemo<MRT_ColumnDef<WalletRequest>[]>(
		() => [
			{
				accessorKey: 'playerName',
				header: 'Player',
				Cell: ({ row }) => (
					<div>
						<Typography
							component={Link}
							to={`/apps/players/${row.original.userId}`}
							className="font-medium"
						>
							<u>{row.original.playerName || row.original.playerEmail}</u>
						</Typography>
						<Typography
							className="text-sm"
							color="text.secondary"
						>
							{row.original.playerEmail}
						</Typography>
					</div>
				)
			},
			{ accessorKey: 'type', header: 'Type' },
			{
				accessorKey: 'amount',
				header: 'Amount',
				Cell: ({ row }) => formatMoney(row.original.amount, row.original.currency)
			},
			{
				accessorKey: 'status',
				header: 'Status',
				Cell: ({ row }) => (
					<Chip
						size="small"
						label={row.original.status.toLowerCase()}
						color={
							row.original.status === 'APPROVED'
								? 'success'
								: row.original.status === 'REJECTED'
									? 'error'
									: 'warning'
						}
						variant="outlined"
					/>
				)
			},
			{
				accessorKey: 'createdAt',
				header: 'Requested',
				Cell: ({ cell }) => format(new Date(cell.getValue<string>()), 'MMM d, yyyy HH:mm')
			},
			{
				accessorKey: 'reviewedBy',
				header: 'Reviewed by',
				Cell: ({ row }) => row.original.reviewedBy || '—'
			},
			{
				id: 'actions',
				header: 'Actions',
				Cell: ({ row }) =>
					row.original.status === 'PENDING' ? (
						<div className="flex gap-1">
							<Button
								size="small"
								color="secondary"
								onClick={() =>
									void update
										.mutateAsync({ id: row.original.id, status: 'APPROVED' })
										.then(() => enqueueSnackbar('Request approved', { variant: 'success' }))
										.catch((error: unknown) =>
											enqueueSnackbar(
												error instanceof Error ? error.message : 'Could not approve',
												{ variant: 'error' }
											)
										)
								}
							>
								Approve
							</Button>
							<Button
								size="small"
								color="error"
								onClick={() =>
									void update
										.mutateAsync({ id: row.original.id, status: 'REJECTED' })
										.then(() => enqueueSnackbar('Request rejected', { variant: 'success' }))
										.catch((error: unknown) =>
											enqueueSnackbar(
												error instanceof Error ? error.message : 'Could not reject',
												{ variant: 'error' }
											)
										)
								}
							>
								Reject
							</Button>
						</div>
					) : (
						<span>—</span>
					)
			}
		],
		[update]
	);

	if (isLoading) {
		return <FuseLoading />;
	}

	return (
		<Root
			header={
				<AdminPageHeader
					title="Wallet requests"
					subtitle="Approve or reject player deposits and withdrawals. Balance only changes after approval."
				/>
			}
			content={
				<Paper
					className="flex h-full w-full flex-auto flex-col overflow-hidden rounded-b-none"
					elevation={2}
				>
					<DataTable
						data={requests}
						columns={columns}
						enableRowActions={false}
						enableRowSelection={false}
					/>
				</Paper>
			}
		/>
	);
}

export default WalletRequestsView;
