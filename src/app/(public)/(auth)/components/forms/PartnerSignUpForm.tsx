'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import _ from 'lodash';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Link from '@fuse/core/Link';

const schema = z
	.object({
		name: z.string().trim().min(2, 'Enter your name'),
		email: z.string().email('Enter a valid email'),
		password: z.string().min(8, 'Password must be at least 8 characters'),
		confirmPassword: z.string().min(8, 'Confirm your password'),
		notes: z.string().optional()
	})
	.refine((value) => value.password === value.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword']
	});

type FormType = z.infer<typeof schema>;

function PartnerSignUpForm() {
	const [submitted, setSubmitted] = useState(false);
	const { control, formState, handleSubmit, setError } = useForm<FormType>({
		mode: 'onChange',
		defaultValues: { name: '', email: '', password: '', confirmPassword: '', notes: '' },
		resolver: zodResolver(schema)
	});
	const { isValid, dirtyFields, errors, isSubmitting } = formState;

	async function onSubmit(formData: FormType) {
		const response = await fetch('/api/winpeak/affiliates/apply', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				name: formData.name,
				email: formData.email,
				password: formData.password,
				notes: formData.notes
			})
		});
		const payload = (await response.json().catch(() => ({}))) as { error?: string; message?: string };

		if (!response.ok) {
			setError('root', { type: 'manual', message: payload.error || 'Unable to submit application' });
			return;
		}

		setSubmitted(true);
	}

	if (submitted) {
		return (
			<Alert severity="success">
				Application received. A staff admin will review it. You can sign in after they approve your account.
			</Alert>
		);
	}

	return (
		<form
			className="flex w-full flex-col justify-center"
			noValidate
			onSubmit={handleSubmit(onSubmit)}
		>
			{errors.root?.message && (
				<Alert
					className="mb-6"
					severity="error"
				>
					{errors.root.message}
				</Alert>
			)}
			<Controller
				name="name"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mb-6"
						label="Full name"
						error={!!errors.name}
						helperText={errors.name?.message}
						required
						fullWidth
					/>
				)}
			/>
			<Controller
				name="email"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mb-6"
						label="Email"
						type="email"
						error={!!errors.email}
						helperText={errors.email?.message}
						required
						fullWidth
					/>
				)}
			/>
			<Controller
				name="password"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mb-6"
						label="Password"
						type="password"
						error={!!errors.password}
						helperText={errors.password?.message}
						required
						fullWidth
					/>
				)}
			/>
			<Controller
				name="confirmPassword"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mb-6"
						label="Confirm password"
						type="password"
						error={!!errors.confirmPassword}
						helperText={errors.confirmPassword?.message}
						required
						fullWidth
					/>
				)}
			/>
			<Controller
				name="notes"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mb-6"
						label="Notes (optional)"
						helperText="Traffic sources, audience, or anything staff should know"
						multiline
						minRows={3}
						fullWidth
					/>
				)}
			/>
			<Button
				variant="contained"
				color="secondary"
				className="mt-2 w-full"
				disabled={_.isEmpty(dirtyFields) || !isValid || isSubmitting}
				type="submit"
				size="large"
			>
				Submit for approval
			</Button>
			<Typography
				className="mt-6 text-center"
				color="text.secondary"
			>
				Already have an account? <Link to="/sign-in">Sign in</Link>
			</Typography>
		</form>
	);
}

export default PartnerSignUpForm;
