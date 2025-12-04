import { getPostsByTag, getAllTags } from '$lib/content.server';
import { parseLanguage } from '$lib/utils/language';
import type { PageServerLoad, EntryGenerator } from './$types';

export const entries: EntryGenerator = async () => {
	// 获取所有标签，为每种语言生成条目
	const tagsZh = getAllTags('zh');
	const tagsEn = getAllTags('en');
	
	// 合并所有唯一的标签
	const allTags = new Set([
		...tagsZh,
		...tagsEn
	]);
	
	return Array.from(allTags).map(tag => ({ tag: encodeURIComponent(tag) }));
};

export const load: PageServerLoad = async ({ params, url }) => {
	const lang = parseLanguage(url);
	const tag = decodeURIComponent(params.tag);
	const posts = getPostsByTag(tag, lang);

	return {
		tag,
		posts,
		lang
	};
};
