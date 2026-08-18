import MainLayout from 'src/components/MainLayout';
import AuthGuardRedirect from '@auth/AuthGuardRedirect';
import AffiliateRouteGate from 'src/components/AffiliateRouteGate';

function Layout({ children }) {
	return (
		<AuthGuardRedirect auth={['admin', 'affiliate']}>
			<AffiliateRouteGate>
				<MainLayout>{children}</MainLayout>
			</AffiliateRouteGate>
		</AuthGuardRedirect>
	);
}

export default Layout;
