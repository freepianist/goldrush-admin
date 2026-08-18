import Typography from '@mui/material/Typography';

function SignUpPageTitle() {
	return (
		<div className="w-full">
			<img
				className="h-10 w-auto"
				src="/assets/images/logo/winpeak-logo.png"
				alt="WinPeak"
			/>

			<Typography className="mt-8 text-4xl leading-[1.25] font-extrabold tracking-tight">
				Partner application
			</Typography>
			<div className="mt-0.5 flex items-baseline font-medium">
				<Typography color="text.secondary">Staff must approve your account before you can sign in</Typography>
			</div>
		</div>
	);
}

export default SignUpPageTitle;
