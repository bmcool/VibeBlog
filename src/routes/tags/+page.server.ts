import { getAllTags } from '$lib/content.server';
import { parseLanguage } from '$lib/utils/language';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const lang = parseLanguage(url);
	return {
		tags: getAllTags(lang),
		lang
	};
};


