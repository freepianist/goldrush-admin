import Typography from '@mui/material/Typography';

function SignInPageTitle() {
	return (
		<div className="w-full">
			<img
				className="w-12"
				src="/assets/images/logo/goldrush.svg"
				alt="Goldrush"
			/>

			<Typography className="mt-8 text-4xl leading-[1.25] font-extrabold tracking-tight">
				Goldrush Admin
			</Typography>
			<div className="mt-0.5 flex items-baseline font-medium">
				<Typography color="text.secondary">Sign in to manage the Goldrush site</Typography>
			</div>
		</div>
	);
}

export default SignInPageTitle;
