import { getAllPostsMeta } from '$lib/content.server';
import { parseLanguage } from '$lib/utils/language';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, depends }) => {
	// 让数据依赖于语言参数，这样切换语言时会重新加载
	const lang = parseLanguage(url);
	depends(`lang:${lang}`);
	
	return {
		posts: getAllPostsMeta(lang),
		lang
	};
};

