import { getAllPostsMeta, getAllTags, getPostModifiedTime } from '$lib/content.server';
import type { RequestHandler } from './$types';

const SITE_URL = 'https://vibeblog.app';

export const prerender = true;

export const GET: RequestHandler = async () => {
	const postsZh = getAllPostsMeta('zh');
	const postsEn = getAllPostsMeta('en');
	const tagsZh = getAllTags('zh');
	const tagsEn = getAllTags('en');
	
	const allPosts = [
		...postsZh.map(post => ({ ...post, lang: 'zh' as const })),
		...postsEn.map(post => ({ ...post, lang: 'en' as const }))
	];
	
	const sitemap = `<?xml version="1.0" encoding="utf-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	<!-- Homepage -->
	<url>
		<loc>${SITE_URL}/</loc>
		<changefreq>daily</changefreq>
		<priority>1.0</priority>
	</url>
	<url>
		<loc>${SITE_URL}/en/</loc>
		<changefreq>daily</changefreq>
		<priority>1.0</priority>
	</url>
	
	<!-- Blog List -->
	<url>
		<loc>${SITE_URL}/blog</loc>
		<changefreq>daily</changefreq>
		<priority>0.9</priority>
	</url>
	<url>
		<loc>${SITE_URL}/en/blog</loc>
		<changefreq>daily</changefreq>
		<priority>0.9</priority>
	</url>
	
	<!-- Tags List -->
	<url>
		<loc>${SITE_URL}/tags</loc>
		<changefreq>weekly</changefreq>
		<priority>0.8</priority>
	</url>
	<url>
		<loc>${SITE_URL}/en/tags</loc>
		<changefreq>weekly</changefreq>
		<priority>0.8</priority>
	</url>
	
	<!-- Blog Posts -->
${allPosts.map(post => {
	const url = post.lang === 'en' 
		? `${SITE_URL}/en/blog/${post.slug}`
		: `${SITE_URL}/blog/${post.slug}`;
	
	// 使用文件修改時間作為 lastmod，如果沒有則使用發布日期
	const modifiedTime = getPostModifiedTime(post.slug);
	const lastmod = modifiedTime 
		? new Date(modifiedTime).toISOString().split('T')[0]
		: new Date(post.date).toISOString().split('T')[0];
	
	return `	<url>
		<loc>${url}</loc>
		<lastmod>${lastmod}</lastmod>
		<changefreq>monthly</changefreq>
		<priority>0.7</priority>
	</url>`;
}).join('\n')}
	
	<!-- Tag Pages -->
${tagsZh.map(tag => {
	const encodedTag = encodeURIComponent(tag);
	const zhUrl = `${SITE_URL}/tags/${encodedTag}`;
	
	return `	<url>
		<loc>${zhUrl}</loc>
		<changefreq>weekly</changefreq>
		<priority>0.6</priority>
	</url>`;
}).join('\n')}
${tagsEn.map(tag => {
	const encodedTag = encodeURIComponent(tag);
	const enUrl = `${SITE_URL}/en/tags/${encodedTag}`;
	
	return `	<url>
		<loc>${enUrl}</loc>
		<changefreq>weekly</changefreq>
		<priority>0.6</priority>
	</url>`;
}).join('\n')}
</urlset>`;

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
};

