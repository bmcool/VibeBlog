import { getPostMeta, getPostContent } from '$lib/content';
import { parseLanguage } from '$lib/utils/language';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url }) => {
	const lang = parseLanguage(url);
	const meta = getPostMeta(params.slug, lang);
	const htmlContent = getPostContent(params.slug, lang);

	if (!meta || !htmlContent) {
		throw error(404, '文章未找到');
	}

	return {
		post: {
			...meta,
			htmlContent
		},
		lang
	};
};

