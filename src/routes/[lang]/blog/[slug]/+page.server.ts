import { getPostMeta, getPostContent, getAllPostsMeta } from '$lib/content.server';
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
	
	// 为每个 slug 生成两种语言的条目
	return Array.from(allSlugs).flatMap(slug => [
		{ lang: 'zh', slug },
		{ lang: 'en', slug }
	]);
};

export const load: PageServerLoad = async ({ params, url }) => {
	// 从路径参数解析语言
	const lang = params?.lang === 'en' ? 'en' : 'zh';
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
