import { getPostMeta, getPostContent } from '$lib/content';
import { getAllPostsMeta } from '$lib/content.server';
import { parseLanguage } from '$lib/utils/language';
import { error } from '@sveltejs/kit';
import type { PageServerLoad, EntryGenerator } from './$types';

export const entries: EntryGenerator = async () => {
	// 获取所有文章，为每种语言生成条目
	const postsZh = getAllPostsMeta('zh');
	const postsEn = getAllPostsMeta('en');
	
	// 合并所有唯一的 slug
	const allSlugs = new Set([
		...postsZh.map(p => p.slug),
		...postsEn.map(p => p.slug)
	]);
	
	return Array.from(allSlugs).map(slug => ({ slug }));
};

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
