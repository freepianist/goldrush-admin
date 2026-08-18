import { Alert } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import AuthJsCredentialsSignInForm from './AuthJsCredentialsSignInForm';
import signinErrors from './signinErrors';

function AuthJsForm() {

	const searchParams = useSearchParams();

	const errorType = searchParams.get('error');

	const error = errorType && (signinErrors[errorType] ?? signinErrors.default);

	return (
		<div className="flex flex-col space-y-8">
			{error && (
				<Alert
					className="mt-4"
					severity="error"
					sx={(theme) => ({
						backgroundColor: theme.palette.error.light,
						color: theme.palette.error.dark
					})}
				>
					{error}
				</Alert>
			)}
			<AuthJsCredentialsSignInForm />
		</div>
	);
}

export default AuthJsForm;
