import { getAllPostsMeta, getAllTags } from '$lib/content.server';
import { parseLanguage } from '$lib/utils/language';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, EntryGenerator } from './$types';

// 只为英文版本生成条目（中文版本在根路由处理）
export const entries: EntryGenerator = async () => {
	return [{ lang: 'en' }];
};

export const load: PageServerLoad = async ({ params, url, depends }) => {
	// 處理 /en/ 重定向到 /en
	if (url.pathname === '/en/') {
		throw redirect(301, '/en');
	}

	// 从路径参数解析语言
	// params.lang 应该包含 'en' 或 'zh'
	const lang = params?.lang === 'en' ? 'en' : 'zh';
	depends(`lang:${lang}`);
	
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

