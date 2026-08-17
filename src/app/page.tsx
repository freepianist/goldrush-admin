import { redirect } from 'next/navigation';

function MainPage() {
	redirect(`/dashboards/goldrush`);
	return null;
}

export default MainPage;
