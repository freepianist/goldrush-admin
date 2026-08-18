'use client';

import { useEffect } from 'react';
import FuseLoading from '@fuse/core/FuseLoading';
import FusePageCarded from '@fuse/core/FusePageCarded';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useParams from '@fuse/hooks/useParams';
import useNavigate from '@fuse/hooks/useNavigate';
import Link from '@fuse/core/Link';
import { enqueueSnackbar } from 'notistack';
import AdminPageHeader from '@/app/(control-panel)/ops/components/AdminPageHeader';
import ImageUploadField from '@/app/(control-panel)/ops/components/ImageUploadField';
import { useBlog, useCreateBlog, useDeleteBlog, useUpdateBlog } from '@/app/(control-panel)/ops/api/hooks/useBlogs';

const schema = z.object({
	title: z.string().min(3, 'Title is required'),
	slug: z.string().optional(),
	excerpt: z.string().min(1, 'Excerpt is required'),
	tag: z.string().min(1, 'Tag is required'),
	author: z.string().min(1, 'Author is required'),
	authorImage: z.string().optional(),
	image: z.string().min(1, 'Image path is required'),
	intro: z.string().min(1, 'Body is required')
});

type FormType = z.infer<typeof schema>;

function BlogPostView() {
	const { postId } = useParams() as { postId: string };
	const isNew = postId === 'new';
	const navigate = useNavigate();
	const { data: post, isLoading, isError } = useBlog(postId);
	const { mutateAsync: createBlog, isPending: creating } = useCreateBlog();
	const { mutateAsync: updateBlog, isPending: saving } = useUpdateBlog(postId);
	const { mutate: deleteBlog } = useDeleteBlog();

	const { control, handleSubmit, reset, formState } = useForm<FormType>({
		mode: 'onChange',
		resolver: zodResolver(schema),
		defaultValues: {
			title: '',
			slug: '',
			excerpt: '',
			tag: 'News',
			author: 'WinPeak Desk',
			authorImage: '/images/avatar/five.png',
			image: '/images/blog/one.png',
			intro: ''
		}
	});

	useEffect(() => {
		if (post) {
			reset({
				title: post.title,
				slug: post.slug,
				excerpt: post.excerpt,
				tag: post.tag,
				author: post.author,
				authorImage: post.authorImage,
				image: post.image,
				intro: post.intro
			});
		}
	}, [post, reset]);

	if (!isNew && isLoading) {
		return <FuseLoading />;
	}

	if (!isNew && isError) {
		return (
			<div className="flex h-full flex-col items-center justify-center gap-4">
				<Typography variant="h5">Post not found</Typography>
				<Button
					component={Link}
					to="/apps/blog"
					variant="outlined"
				>
					Back to blog
				</Button>
			</div>
		);
	}

	async function onSave(values: FormType) {
		try {
			if (isNew) {
				const created = await createBlog(values);
				enqueueSnackbar('Post published', { variant: 'success' });
				navigate(`/apps/blog/${created.id}`);
				return;
			}

			await updateBlog(values);
			enqueueSnackbar('Post saved', { variant: 'success' });
		} catch (error) {
			enqueueSnackbar(error instanceof Error ? error.message : 'Could not save post', { variant: 'error' });
		}
	}

	return (
		<FusePageCarded
			header={
				<AdminPageHeader
					title={isNew ? 'New blog post' : post?.title || 'Blog post'}
					subtitle="This content is shown on the public WinPeak blog"
					action={
						<div className="flex gap-2">
							{!isNew && (
								<Button
									color="error"
									variant="outlined"
									onClick={() => {
										deleteBlog(postId);
										navigate('/apps/blog');
									}}
								>
									Delete
								</Button>
							)}
							<Button
								variant="contained"
								color="secondary"
								disabled={creating || saving || !formState.isValid}
								onClick={handleSubmit(onSave)}
							>
								{isNew ? 'Publish' : 'Save'}
							</Button>
						</div>
					}
				/>
			}
			content={
				<div className="mx-auto flex w-full max-w-4xl flex-col gap-4 p-4 sm:p-6">
					<Controller
						name="title"
						control={control}
						render={({ field, fieldState }) => (
							<TextField
								{...field}
								label="Title"
								error={!!fieldState.error}
								helperText={fieldState.error?.message}
								fullWidth
							/>
						)}
					/>
					<div className="grid gap-4 sm:grid-cols-2">
						<Controller
							name="slug"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Slug"
									helperText="Leave blank to generate from the title"
									fullWidth
								/>
							)}
						/>
						<Controller
							name="tag"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Tag"
									fullWidth
								/>
							)}
						/>
					</div>
					<Controller
						name="excerpt"
						control={control}
						render={({ field, fieldState }) => (
							<TextField
								{...field}
								label="Excerpt"
								error={!!fieldState.error}
								helperText={fieldState.error?.message}
								multiline
								minRows={2}
								fullWidth
							/>
						)}
					/>
					<Controller
						name="author"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="Author"
								fullWidth
							/>
						)}
					/>
					<div className="grid gap-6 sm:grid-cols-2">
						<Controller
							name="image"
							control={control}
							render={({ field, fieldState }) => (
								<ImageUploadField
									label="Cover image"
									value={field.value}
									folder="blog"
									variant="cover"
									error={fieldState.error?.message}
									onChange={field.onChange}
								/>
							)}
						/>
						<Controller
							name="authorImage"
							control={control}
							render={({ field, fieldState }) => (
								<ImageUploadField
									label="Author image"
									value={field.value}
									folder="authors"
									variant="avatar"
									error={fieldState.error?.message}
									onChange={field.onChange}
								/>
							)}
						/>
					</div>
					<Controller
						name="intro"
						control={control}
						render={({ field, fieldState }) => (
							<TextField
								{...field}
								label="Body"
								helperText={fieldState.error?.message || 'Separate paragraphs with a blank line'}
								error={!!fieldState.error}
								multiline
								minRows={8}
								fullWidth
							/>
						)}
					/>
				</div>
			}
		/>
	);
}

export default BlogPostView;
