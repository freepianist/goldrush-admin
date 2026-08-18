'use client';

import FusePageSimple from '@fuse/core/FusePageSimple';
import FuseLoading from '@fuse/core/FuseLoading';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import { enqueueSnackbar } from 'notistack';
import AdminPageHeader from '@/app/(control-panel)/ops/components/AdminPageHeader';
import { useMyAffiliate } from '@/app/(control-panel)/ops/api/hooks/useAffiliates';
import { formatMoney } from '@/lib/money';

function PartnerPortalView() {
	const { data, isLoading, isError, error, refetch } = useMyAffiliate();

	if (isLoading) {
		return <FuseLoading />;
	}

	if (isError || !data) {
		return (
			<div className="flex h-full flex-col items-center justify-center gap-4 p-8">
				<Typography variant="h5">Could not load your partner dashboard</Typography>
				<Typography color="text.secondary">
					{error instanceof Error ? error.message : 'Ask WinPeak staff to activate your account.'}
				</Typography>
				<Button
					variant="contained"
					color="secondary"
					onClick={() => refetch()}
				>
					Retry
				</Button>
			</div>
		);
	}

	const deal =
		data.partner.dealType === 'CPA'
			? `CPA ${formatMoney(data.partner.cpaAmount)} per first deposit`
			: data.partner.dealType === 'REVSHARE'
				? `${data.partner.revSharePercent}% of referred player GGR`
				: `CPA ${formatMoney(data.partner.cpaAmount)} plus ${data.partner.revSharePercent}% rev share`;

	return (
		<FusePageSimple
			header={
				<AdminPageHeader
					title={`Welcome, ${data.partner.name}`}
					subtitle={deal}
				/>
			}
			content={
				<div className="w-full px-4 pt-4 pb-8 md:px-8">
					<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
						<Paper className="rounded-xl p-6 shadow-sm">
							<Typography color="text.secondary">Signups</Typography>
							<Typography className="mt-1 text-3xl font-semibold">{data.stats.signups}</Typography>
						</Paper>
						<Paper className="rounded-xl p-6 shadow-sm">
							<Typography color="text.secondary">First deposits</Typography>
							<Typography className="mt-1 text-3xl font-semibold">{data.stats.ftds}</Typography>
						</Paper>
						<Paper className="rounded-xl p-6 shadow-sm">
							<Typography color="text.secondary">Estimated earnings</Typography>
							<Typography className="mt-1 text-3xl font-semibold">
								{formatMoney(data.stats.bookedCpa + data.stats.estimatedRevShare)}
							</Typography>
						</Paper>
						<Paper className="rounded-xl p-6 shadow-sm">
							<Typography color="text.secondary">Paid out</Typography>
							<Typography className="mt-1 text-3xl font-semibold">{formatMoney(data.stats.paidOut)}</Typography>
						</Paper>
					</div>

					<div className="mt-4 grid gap-4 xl:grid-cols-3">
						<Paper className="flex flex-col gap-3 rounded-xl p-6 shadow-sm xl:col-span-2">
							<Typography className="text-lg font-semibold">Your tracking link</Typography>
							<Typography
								color="text.secondary"
								className="text-sm"
							>
								Share this URL. New players who register after opening it are attributed to you for 30 days.
							</Typography>
							<TextField
								value={data.partner.trackingLink}
								fullWidth
								slotProps={{ input: { readOnly: true } }}
							/>
							<Button
								variant="outlined"
								onClick={() => {
									void navigator.clipboard.writeText(data.partner.trackingLink);
									enqueueSnackbar('Link copied', { variant: 'success' });
								}}
							>
								Copy link
							</Button>
						</Paper>

						<Paper className="flex flex-col gap-3 rounded-xl p-6 shadow-sm">
							<Typography className="text-lg font-semibold">Your deal</Typography>
							<div className="flex items-center justify-between">
								<Typography color="text.secondary">Type</Typography>
								<Chip
									size="small"
									label={data.partner.dealType}
									color="secondary"
									variant="outlined"
								/>
							</div>
							<div className="flex items-center justify-between">
								<Typography color="text.secondary">Code</Typography>
								<Typography className="font-semibold">{data.partner.code}</Typography>
							</div>
							<div className="flex items-center justify-between">
								<Typography color="text.secondary">Pending</Typography>
								<Typography className="font-semibold">{formatMoney(data.stats.pending)}</Typography>
							</div>
							<Button
								component={NavLinkAdapter}
								to="/apps/partner/earnings"
								size="small"
							>
								Earnings history
							</Button>
						</Paper>
					</div>
				</div>
			}
		/>
	);
}

export default PartnerPortalView;
