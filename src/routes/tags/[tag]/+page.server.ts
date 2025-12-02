import { getPostsByTag } from '$lib/content';
import { parseLanguage } from '$lib/utils/language';
import type { PageServerLoad } from './$types';

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


