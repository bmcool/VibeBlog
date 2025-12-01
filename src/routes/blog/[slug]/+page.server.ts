import { getPost } from '$lib/data/posts';
import { error } from '@sveltejs/kit';
import { marked } from 'marked';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const post = getPost(params.slug);

	if (!post) {
		throw error(404, '文章未找到');
	}

	// 在 server 端轉換 markdown 為 HTML
	const htmlContent = await marked.parse(post.content);

	return {
		post: {
			...post,
			htmlContent
		}
	};
};

