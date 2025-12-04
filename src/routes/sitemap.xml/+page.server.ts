import { getAllPostsMeta } from '$lib/content.server';
import type { PageServerLoad } from './$types';

const SITE_URL = 'https://vibeblog.app';

export const prerender = true;

export const load: PageServerLoad = async () => {
	const postsZh = getAllPostsMeta('zh');
	const postsEn = getAllPostsMeta('en');
	
	const allPosts = [
		...postsZh.map(post => ({ ...post, lang: 'zh' as const })),
		...postsEn.map(post => ({ ...post, lang: 'en' as const }))
	];
	
	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
	<!-- Homepage -->
	<url>
		<loc>${SITE_URL}/</loc>
		<changefreq>daily</changefreq>
		<priority>1.0</priority>
		<xhtml:link rel="alternate" hreflang="zh-TW" href="${SITE_URL}/" />
		<xhtml:link rel="alternate" hreflang="en-US" href="${SITE_URL}/?lang=en" />
	</url>
	
	<!-- Blog List -->
	<url>
		<loc>${SITE_URL}/blog</loc>
		<changefreq>daily</changefreq>
		<priority>0.9</priority>
		<xhtml:link rel="alternate" hreflang="zh-TW" href="${SITE_URL}/blog" />
		<xhtml:link rel="alternate" hreflang="en-US" href="${SITE_URL}/blog?lang=en" />
	</url>
	
	<!-- Tags List -->
	<url>
		<loc>${SITE_URL}/tags</loc>
		<changefreq>weekly</changefreq>
		<priority>0.8</priority>
		<xhtml:link rel="alternate" hreflang="zh-TW" href="${SITE_URL}/tags" />
		<xhtml:link rel="alternate" hreflang="en-US" href="${SITE_URL}/tags?lang=en" />
	</url>
	
	<!-- Blog Posts -->
${allPosts.map(post => {
	const url = post.lang === 'en' 
		? `${SITE_URL}/blog/${post.slug}?lang=en`
		: `${SITE_URL}/blog/${post.slug}`;
	const lastmod = new Date(post.date).toISOString().split('T')[0];
	
	return `	<url>
		<loc>${url}</loc>
		<lastmod>${lastmod}</lastmod>
		<changefreq>monthly</changefreq>
		<priority>0.7</priority>
		<xhtml:link rel="alternate" hreflang="zh-TW" href="${SITE_URL}/blog/${post.slug}" />
		<xhtml:link rel="alternate" hreflang="en-US" href="${SITE_URL}/blog/${post.slug}?lang=en" />
	</url>`;
}).join('\n')}
</urlset>`;

	return {
		sitemap
	};
};

