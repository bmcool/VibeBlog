import { getPostsByTag, getAllTags } from '$lib/content.server';
import { translateTag } from '$lib/tagsI18n.server';
import type { Language } from '$lib/types/blog';
import type { PageServerLoad, EntryGenerator } from './$types';
import { redirect } from '@sveltejs/kit';

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
	const lang: Language = params?.lang === 'en' ? 'en' : 'zh';
	const tag = decodeURIComponent(params.tag);

	// If the tag doesn't exist in the current language index, try translating it
	// (e.g. /tags/AI開發 -> switch to /en/tags/AI Development) to avoid 404 on language switch.
	const tagsInLang = new Set(getAllTags(lang));
	if (!tagsInLang.has(tag)) {
		const otherLang = lang === 'en' ? 'zh' : 'en';
		const translated = translateTag(tag, otherLang, lang);
		if (translated && tagsInLang.has(translated)) {
			throw redirect(302, `/${lang === 'en' ? 'en/' : ''}tags/${encodeURIComponent(translated)}`);
		}
	}

	const posts = getPostsByTag(tag, lang);

	// Provide tag translation for hreflang / UI usage
	const tagZh = lang === 'zh' ? tag : (translateTag(tag, 'en', 'zh') ?? tag);
	const tagEn = lang === 'en' ? tag : (translateTag(tag, 'zh', 'en') ?? tag);

	return {
		tag,
		posts,
		lang,
		tagZh,
		tagEn
	};
};
