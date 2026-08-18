import { redirect } from 'next/navigation';

function DashboardsPage() {
	redirect(`/dashboards/winpeak`);
	return null;
}

export default DashboardsPage;
