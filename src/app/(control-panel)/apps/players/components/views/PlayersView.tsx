'use client';

import FusePageCarded from '@fuse/core/FusePageCarded';
import { styled } from '@mui/material/styles';
import AdminPageHeader from '@/app/(control-panel)/goldrush/components/AdminPageHeader';
import PlayersTable from '../ui/PlayersTable';

const Root = styled(FusePageCarded)(() => ({
	'& .container': {
		maxWidth: '100%!important'
	}
}));

function PlayersView() {
	return (
		<Root
			header={
				<AdminPageHeader
					title="Players"
					subtitle="Accounts, wallets, and access"
				/>
			}
			content={<PlayersTable />}
		/>
	);
}

export default PlayersView;
