import { getAllPostsMeta } from '$lib/content.server';
import { parseLanguage } from '$lib/utils/language';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const lang = parseLanguage(url);
	return {
		posts: getAllPostsMeta(lang),
		lang
	};
};

