import { getAllPostsMeta, getAllTags } from '$lib/content';
import { parseLanguage } from '$lib/utils/language';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const lang = parseLanguage(url);
	const posts = getAllPostsMeta(lang);
	const tags = getAllTags(lang);
	
	// 获取最新3篇文章
	const latestPosts = posts.slice(0, 3);
	
	// 获取热门标签（按文章数量排序，取前6个）
	const tagCounts = tags.map(tag => {
		const postsWithTag = posts.filter(post => post.tags?.includes(tag));
		return { tag, count: postsWithTag.length };
	}).sort((a, b) => b.count - a.count).slice(0, 6);
	
	return {
		latestPost: posts[0] || null,
		latestPosts,
		popularTags: tagCounts.map(t => t.tag),
		lang
	};
};

