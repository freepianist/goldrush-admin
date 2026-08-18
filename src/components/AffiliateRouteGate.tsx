'use client';

import { ReactNode, useEffect } from 'react';
import FuseLoading from '@fuse/core/FuseLoading';
import usePathname from '@fuse/hooks/usePathname';
import useNavigate from '@fuse/hooks/useNavigate';
import useUser from '@auth/useUser';

const PARTNER_PREFIXES = ['/dashboards/partner', '/apps/partner'];

function isPartnerPath(pathname: string) {
	return PARTNER_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function AffiliateRouteGate({ children }: { children: ReactNode }) {
	const { data: user } = useUser();
	const pathname = usePathname();
	const navigate = useNavigate();
	const roles = Array.isArray(user?.role) ? user.role : user?.role ? [user.role] : [];
	const isAffiliateOnly = roles.includes('affiliate') && !roles.includes('admin');
	const blocked = isAffiliateOnly && !isPartnerPath(pathname);

	useEffect(() => {
		if (blocked) {
			navigate('/dashboards/partner');
		}
	}, [blocked, navigate]);

	if (blocked) {
		return <FuseLoading />;
	}

	return children;
}

export default AffiliateRouteGate;
