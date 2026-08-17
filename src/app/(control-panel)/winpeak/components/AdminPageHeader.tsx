'use client';

import Typography from '@mui/material/Typography';
import { motion } from 'motion/react';
import PageBreadcrumb from 'src/components/PageBreadcrumb';
import { ReactNode } from 'react';

type AdminPageHeaderProps = {
	title: string;
	subtitle?: string;
	action?: ReactNode;
};

function AdminPageHeader(props: AdminPageHeaderProps) {
	const { title, subtitle, action } = props;

	return (
		<div className="flex flex-auto flex-col py-4">
			<PageBreadcrumb className="mb-2" />
			<div className="flex min-w-0 flex-auto flex-col gap-2 sm:flex-row sm:items-center">
				<div className="flex flex-auto flex-col">
					<motion.span
						initial={{ x: -20 }}
						animate={{ x: 0, transition: { delay: 0.15 } }}
					>
						<Typography className="text-3xl leading-none font-extrabold tracking-tight md:text-4xl">
							{title}
						</Typography>
					</motion.span>
					{subtitle && (
						<Typography
							className="mt-1 font-medium"
							color="text.secondary"
						>
							{subtitle}
						</Typography>
					)}
				</div>
				{action && (
					<motion.div
						className="flex grow-0"
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0, transition: { delay: 0.15 } }}
					>
						{action}
					</motion.div>
				)}
			</div>
		</div>
	);
}

export default AdminPageHeader;
