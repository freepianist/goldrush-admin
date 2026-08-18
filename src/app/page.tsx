import { redirect } from 'next/navigation';

function MainPage() {
	redirect(`/dashboards/winpeak`);
	return null;
}

export default MainPage;
