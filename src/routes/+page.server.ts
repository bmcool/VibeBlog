import { getAllPostsMeta } from '$lib/content';
import { parseLanguage } from '$lib/utils/language';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const lang = parseLanguage(url);
	const posts = getAllPostsMeta(lang);
	
	return {
		latestPost: posts[0] || null,
		lang
	};
};

