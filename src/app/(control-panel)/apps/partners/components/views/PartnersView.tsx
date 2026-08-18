'use client';

import { useMemo, useState } from 'react';
import { type MRT_ColumnDef } from 'material-react-table';
import DataTable from 'src/components/data-table/DataTable';
import FuseLoading from '@fuse/core/FuseLoading';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Link from '@fuse/core/Link';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { format } from 'date-fns';
import AdminPageHeader from '@/app/(control-panel)/ops/components/AdminPageHeader';
import { useInvitePartner, usePartners } from '@/app/(control-panel)/ops/api/hooks/useAffiliates';
import type { AffiliateDealType, AffiliatePartner } from '@/app/(control-panel)/ops/api/types';
import { formatMoney } from '@/lib/money';

const Root = styled(FusePageCarded)(() => ({
	'& .container': {
		maxWidth: '100%!important'
	}
}));

const emptyForm = {
	name: '',
	email: '',
	dealType: 'HYBRID' as AffiliateDealType,
	cpaAmount: '50',
	revSharePercent: '25',
	notes: '',
	password: ''
};

function PartnersView() {
	const { data: partners = [], isLoading } = usePartners();
	const invite = useInvitePartner();
	const [open, setOpen] = useState(false);
	const [form, setForm] = useState(emptyForm);
	const [created, setCreated] = useState<AffiliatePartner | null>(null);

	const columns = useMemo<MRT_ColumnDef<AffiliatePartner>[]>(
		() => [
			{
				accessorKey: 'name',
				header: 'Partner',
				Cell: ({ row }) => (
					<div>
						<Typography
							component={Link}
							to={`/apps/partners/${row.original.id}`}
							className="font-medium"
						>
							<u>{row.original.name}</u>
						</Typography>
						<Typography
							className="text-sm"
							color="text.secondary"
						>
							{row.original.email}
						</Typography>
					</div>
				)
			},
			{ accessorKey: 'code', header: 'Code' },
			{
				accessorKey: 'dealType',
				header: 'Deal',
				Cell: ({ row }) => {
					const deal = row.original;
					if (deal.dealType === 'CPA') return `CPA ${formatMoney(deal.cpaAmount)}`;
					if (deal.dealType === 'REVSHARE') return `${deal.revSharePercent}% RS`;
					return `CPA ${formatMoney(deal.cpaAmount)} + ${deal.revSharePercent}% RS`;
				}
			},
			{
				accessorKey: 'status',
				header: 'Status',
				Cell: ({ row }) => (
					<Chip
						size="small"
						label={row.original.status.toLowerCase()}
						color={row.original.status === 'ACTIVE' ? 'success' : row.original.status === 'PAUSED' ? 'warning' : 'default'}
						variant="outlined"
					/>
				)
			},
			{
				id: 'ftds',
				header: 'FTDs',
				accessorFn: (row) => row.stats?.ftds || 0
			},
			{
				id: 'pending',
				header: 'Pending',
				accessorFn: (row) => row.stats?.pending || 0,
				Cell: ({ row }) => formatMoney(row.original.stats?.pending || 0)
			},
			{
				accessorKey: 'createdAt',
				header: 'Invited',
				Cell: ({ cell }) => format(new Date(cell.getValue<string>()), 'MMM d, yyyy')
			}
		],
		[]
	);

	async function handleInvite() {
		const partner = await invite.mutateAsync({
			name: form.name,
			email: form.email,
			dealType: form.dealType,
			cpaAmount: Number(form.cpaAmount || 0),
			revSharePercent: Number(form.revSharePercent || 0),
			notes: form.notes,
			password: form.password || undefined
		});
		setCreated(partner);
	}

	if (isLoading) {
		return <FuseLoading />;
	}

	return (
		<Root
			header={
				<AdminPageHeader
					title="Affiliate partners"
					subtitle="Invite partners and set CPA, rev share, or hybrid terms"
					action={
						<Button
							variant="contained"
							color="secondary"
							startIcon={<FuseSvgIcon>lucide:plus</FuseSvgIcon>}
							onClick={() => {
								setCreated(null);
								setForm(emptyForm);
								setOpen(true);
							}}
						>
							Invite partner
						</Button>
					}
				/>
			}
			content={
				<Paper
					className="flex h-full w-full flex-auto flex-col overflow-hidden rounded-b-none"
					elevation={2}
				>
					<DataTable
						data={partners}
						columns={columns}
						enableRowActions={false}
						enableRowSelection={false}
					/>
					<Dialog
						open={open}
						onClose={() => setOpen(false)}
						fullWidth
						maxWidth="sm"
					>
						<DialogTitle>{created ? 'Partner invited' : 'Invite affiliate partner'}</DialogTitle>
						<DialogContent className="flex flex-col gap-4 pt-2">
							{created ? (
								<>
									<Alert severity="success">
										Share these credentials once. The partner signs in to this admin with their own portal.
									</Alert>
									<TextField
										label="Tracking link"
										value={created.trackingLink}
										fullWidth
										slotProps={{ input: { readOnly: true } }}
									/>
									<TextField
										label="Email"
										value={created.email}
										fullWidth
										slotProps={{ input: { readOnly: true } }}
									/>
									<TextField
										label="Temporary password"
										value={created.temporaryPassword || ''}
										fullWidth
										slotProps={{ input: { readOnly: true } }}
									/>
								</>
							) : (
								<>
									<TextField
										label="Name"
										value={form.name}
										onChange={(event) => setForm({ ...form, name: event.target.value })}
										fullWidth
									/>
									<TextField
										label="Email"
										type="email"
										value={form.email}
										onChange={(event) => setForm({ ...form, email: event.target.value })}
										fullWidth
									/>
									<TextField
										select
										label="Deal type"
										value={form.dealType}
										onChange={(event) =>
											setForm({ ...form, dealType: event.target.value as AffiliateDealType })
										}
										fullWidth
									>
										<MenuItem value="CPA">CPA — fixed payout on first deposit</MenuItem>
										<MenuItem value="REVSHARE">Rev share — percent of referred GGR</MenuItem>
										<MenuItem value="HYBRID">Hybrid — CPA plus rev share</MenuItem>
									</TextField>
									{form.dealType !== 'REVSHARE' && (
										<TextField
											label="CPA amount"
											type="number"
											value={form.cpaAmount}
											onChange={(event) => setForm({ ...form, cpaAmount: event.target.value })}
											fullWidth
										/>
									)}
									{form.dealType !== 'CPA' && (
										<TextField
											label="Rev share %"
											type="number"
											value={form.revSharePercent}
											onChange={(event) => setForm({ ...form, revSharePercent: event.target.value })}
											fullWidth
										/>
									)}
									<TextField
										label="Portal password (optional)"
										helperText="Leave blank to generate one"
										value={form.password}
										onChange={(event) => setForm({ ...form, password: event.target.value })}
										fullWidth
									/>
									<TextField
										label="Internal notes"
										value={form.notes}
										onChange={(event) => setForm({ ...form, notes: event.target.value })}
										multiline
										minRows={2}
										fullWidth
									/>
									{invite.isError && (
										<Alert severity="error">
											{invite.error instanceof Error ? invite.error.message : 'Invite failed'}
										</Alert>
									)}
								</>
							)}
						</DialogContent>
						<DialogActions>
							<Button onClick={() => setOpen(false)}>{created ? 'Done' : 'Cancel'}</Button>
							{!created && (
								<Button
									variant="contained"
									color="secondary"
									onClick={() => void handleInvite()}
									disabled={invite.isPending || !form.name || !form.email}
								>
									Invite
								</Button>
							)}
						</DialogActions>
					</Dialog>
				</Paper>
			}
		/>
	);
}

export default PartnersView;
