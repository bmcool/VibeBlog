import { getAllTags } from '$lib/content.server';
import { parseLanguage } from '$lib/utils/language';
import type { PageServerLoad, EntryGenerator } from './$types';

// 只为英文版本生成条目
export const entries: EntryGenerator = async () => {
	return [{ lang: 'en' }];
};

export const load: PageServerLoad = async ({ params, url }) => {
	// 从路径参数解析语言
	const lang = params?.lang === 'en' ? 'en' : 'zh';
	return {
		tags: getAllTags(lang),
		lang
	};
};


