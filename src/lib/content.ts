import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { PostMeta, TagsIndex, Language } from '$lib/types/blog';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const META_DIR = path.join(__dirname, '../../content/meta');
const INDEXES_DIR = path.join(__dirname, '../../content/indexes');
const PROCESSED_DIR = path.join(__dirname, '../../content/processed');

/**
 * 讀取單篇文章的 metadata
 */
export function getPostMeta(slug: string, lang: Language = 'zh'): PostMeta | null {
	try {
		const filePath = path.join(META_DIR, `${slug}.json`);
		if (!fs.existsSync(filePath)) {
			return null;
		}
		const raw = fs.readFileSync(filePath, 'utf-8');
		const meta = JSON.parse(raw) as PostMeta;
		
		// 根據語言返回對應的字段
		if (lang === 'en') {
			return {
				...meta,
				title: meta.titleEn || meta.title,
				summary: meta.summaryEn || meta.summary,
				description: meta.descriptionEn || meta.description,
				tags: meta.tagsEn || meta.tags
			};
		}
		
		return meta;
	} catch (error) {
		console.error(`Error reading post meta for ${slug}:`, error);
		return null;
	}
}

/**
 * 讀取所有文章的 metadata（用於需要完整列表的情況）
 */
export function getAllPostsMeta(lang: Language = 'zh'): PostMeta[] {
	try {
		if (!fs.existsSync(META_DIR)) {
			return [];
		}
		const files = fs.readdirSync(META_DIR);
		return files
			.filter((f) => f.endsWith('.json'))
			.map((file) => {
				const slug = file.replace('.json', '');
				return getPostMeta(slug, lang);
			})
			.filter((meta): meta is PostMeta => meta !== null)
			.sort((a, b) => (a.date < b.date ? 1 : -1));
	} catch (error) {
		console.error('Error reading all posts meta:', error);
		return [];
	}
}

/**
 * 讀取預計算的 tags index
 */
export function getTagsIndex(lang: Language = 'zh'): TagsIndex {
	try {
		const indexPath = path.join(INDEXES_DIR, lang === 'en' ? 'tags.en.json' : 'tags.json');
		if (!fs.existsSync(indexPath)) {
			return {};
		}
		const raw = fs.readFileSync(indexPath, 'utf-8');
		return JSON.parse(raw) as TagsIndex;
	} catch (error) {
		console.error('Error reading tags index:', error);
		return {};
	}
}

/**
 * 取得所有標籤列表（從預計算的 tags.json）
 */
export function getAllTags(lang: Language = 'zh'): string[] {
	const tagsIndex = getTagsIndex(lang);
	return Object.keys(tagsIndex).sort();
}

/**
 * 根據 tag 取得文章列表（使用預計算的 tags.json）
 */
export function getPostsByTag(tag: string, lang: Language = 'zh'): PostMeta[] {
	const tagsIndex = getTagsIndex(lang);
	const slugs = tagsIndex[tag] || [];
	return slugs
		.map((slug) => getPostMeta(slug, lang))
		.filter((meta): meta is PostMeta => meta !== null)
		.sort((a, b) => (a.date < b.date ? 1 : -1));
}

/**
 * 讀取處理後的 HTML 內容
 */
export function getPostContent(slug: string, lang: Language = 'zh'): string | null {
	try {
		// 優先讀取語言特定版本，如果不存在則回退到默認版本
		let contentPath: string;
		if (lang === 'en') {
			contentPath = path.join(PROCESSED_DIR, `${slug}.en.html`);
			if (!fs.existsSync(contentPath)) {
				// 如果英文版不存在，回退到中文版
				contentPath = path.join(PROCESSED_DIR, `${slug}.html`);
			}
		} else {
			contentPath = path.join(PROCESSED_DIR, `${slug}.html`);
		}
		
		if (!fs.existsSync(contentPath)) {
			return null;
		}
		return fs.readFileSync(contentPath, 'utf-8');
	} catch (error) {
		console.error(`Error reading post content for ${slug}:`, error);
		return null;
	}
}

// parseLanguage 已移至 $lib/utils/language.ts 以支持客戶端使用


