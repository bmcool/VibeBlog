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
	
	// 为每个标签生成两种语言的条目
	return Array.from(allTags).flatMap(tag => [
		{ lang: 'zh', tag: encodeURIComponent(tag) },
		{ lang: 'en', tag: encodeURIComponent(tag) }
	]);
};

export const load: PageServerLoad = async ({ params, url }) => {
	// 从路径参数解析语言
	const lang = params?.lang === 'en' ? 'en' : 'zh';
	const tag = decodeURIComponent(params.tag);
	const posts = getPostsByTag(tag, lang);

	return {
		tag,
		posts,
		lang
	};
};
