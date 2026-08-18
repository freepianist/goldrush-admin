import { redirect } from 'next/navigation';

function PartnerPage() {
	redirect('/dashboards/partner');
	return null;
}

export default PartnerPage;
