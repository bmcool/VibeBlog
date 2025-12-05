import type { PostMeta, Language } from '$lib/types/blog';
import { getLangPath } from './language';

const SITE_URL = 'https://vibeblog.app';
const SITE_NAME = 'VibeBlog';
const DEFAULT_DESCRIPTION = {
	zh: '分享 AI、開發工具與技術見解的技術部落格',
	en: 'A tech blog sharing insights on AI, development tools, and technology'
};

/**
 * 構建帶語言的路徑
 * @param path 原始路徑（不包含語言前綴）
 * @param lang 語言
 * @returns 完整的路徑
 */
export function buildLangPath(path: string, lang: Language): string {
	const langPrefix = getLangPath(lang);
	// 確保路徑以 / 開頭
	const normalizedPath = path.startsWith('/') ? path : `/${path}`;
	return langPrefix + normalizedPath;
}

export interface SEOData {
	title: string;
	description: string;
	image?: string;
	url: string;
	type?: 'website' | 'article';
	publishedTime?: string;
	modifiedTime?: string;
	author?: string;
	tags?: string[];
	lang: Language;
}

export function generateSEOTags(data: SEOData) {
	const fullTitle = data.title.includes(SITE_NAME) 
		? data.title 
		: `${data.title} - ${SITE_NAME}`;
	
	const imageUrl = data.image 
		? (data.image.startsWith('http') ? data.image : `${SITE_URL}${data.image}`)
		: `${SITE_URL}/images/homepage-hero.png`;
	
	const canonicalUrl = data.url.startsWith('http') ? data.url : `${SITE_URL}${data.url}`;
	
	return {
		title: fullTitle,
		description: data.description || DEFAULT_DESCRIPTION[data.lang],
		image: imageUrl,
		url: canonicalUrl,
		type: data.type || 'website',
		publishedTime: data.publishedTime,
		modifiedTime: data.modifiedTime,
		author: data.author || SITE_NAME,
		tags: data.tags || [],
		lang: data.lang
	};
}

export function generateStructuredData(data: SEOData) {
	const seo = generateSEOTags(data);
	
	if (data.type === 'article') {
		const structuredData: any = {
			'@context': 'https://schema.org',
			'@type': 'BlogPosting',
			headline: data.title,
			description: seo.description,
			image: seo.image,
			datePublished: data.publishedTime,
			dateModified: data.modifiedTime || data.publishedTime,
			author: {
				'@type': 'Person',
				name: seo.author
			},
			publisher: {
				'@type': 'Organization',
				name: SITE_NAME,
				logo: {
					'@type': 'ImageObject',
					url: `${SITE_URL}/images/vibeblog-icon.png`
				}
			},
			mainEntityOfPage: {
				'@type': 'WebPage',
				'@id': seo.url
			},
			inLanguage: data.lang === 'zh' ? 'zh-TW' : 'en-US'
		};
		
		// 如果有標籤，添加 articleSection
		if (data.tags && data.tags.length > 0) {
			structuredData.articleSection = data.tags[0]; // 使用第一個標籤作為主要分類
			structuredData.keywords = data.tags.join(', ');
		}
		
		return structuredData;
	}
	
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: SITE_NAME,
		url: SITE_URL,
		description: seo.description,
		inLanguage: data.lang === 'zh' ? 'zh-TW' : 'en-US',
		potentialAction: {
			'@type': 'SearchAction',
			target: {
				'@type': 'EntryPoint',
				urlTemplate: `${SITE_URL}/tags?q={search_term_string}`
			},
			'query-input': 'required name=search_term_string'
		}
	};
}

