import { redirect } from 'next/navigation';

function AppsPage() {
	redirect(`/apps/players`);
	return null;
}

export default AppsPage;
