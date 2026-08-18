import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';

const Root = styled('div')(({ theme }) => ({
	'& > .logo-icon': {
		transition: theme.transitions.create(['width', 'height'], {
			duration: theme.transitions.duration.shortest,
			easing: theme.transitions.easing.easeInOut
		})
	}
}));

type LogoProps = {
	className?: string;
};

function Logo(props: LogoProps) {
	const { className = '' } = props;

	return (
		<Root className={clsx('flex flex-shrink-0 flex-grow items-center gap-3', className)}>
			<div className="flex flex-1 items-end gap-2">
				<img
					className="logo-icon h-8 w-auto"
					src="/assets/images/logo/winpeak-logo.png"
					alt="WinPeak"
				/>
				<div className="logo-text flex flex-auto flex-col">
					<Typography
						className="tracking-light pb-1.5 text-[12px] leading-none font-semibold"
						color="text.secondary"
					>
						Admin
					</Typography>
				</div>
			</div>
		</Root>
	);
}

export default Logo;
