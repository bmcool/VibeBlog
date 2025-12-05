import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { PostMeta, TagsIndex, Language } from '$lib/types/blog';

// 使用更可靠的路径解析方法
// 在构建时，__dirname 可能指向 .svelte-kit 目录，所以使用 process.cwd() 作为基准
const getContentDir = () => {
	// 尝试从当前文件位置解析
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);
	const relativePath = path.join(__dirname, '../../content');
	
	// 如果相对路径存在，使用它；否则使用 process.cwd()
	if (fs.existsSync(relativePath)) {
		return relativePath;
	}
	// 回退到项目根目录
	return path.join(process.cwd(), 'content');
};

const CONTENT_DIR = getContentDir();
const META_DIR = path.join(CONTENT_DIR, 'meta');
const INDEXES_DIR = path.join(CONTENT_DIR, 'indexes');
const PROCESSED_DIR = path.join(CONTENT_DIR, 'processed');

/**
 * 獲取文章文件的修改時間
 */
export function getPostModifiedTime(slug: string): string | null {
	try {
		const filePath = path.join(META_DIR, `${slug}.json`);
		if (!fs.existsSync(filePath)) {
			return null;
		}
		const stats = fs.statSync(filePath);
		return stats.mtime.toISOString();
	} catch (error) {
		console.error(`Error getting post modified time for ${slug}:`, error);
		return null;
	}
}

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
		const postsWithStats = files
			.filter((f) => f.endsWith('.json'))
			.map((file) => {
				const slug = file.replace('.json', '');
				const meta = getPostMeta(slug, lang);
				if (!meta) return null;
				
				// 獲取文件修改時間作為次要排序鍵
				const filePath = path.join(META_DIR, file);
				const stats = fs.statSync(filePath);
				
				return {
					meta,
					mtime: stats.mtime.getTime() // 文件修改時間（毫秒）
				};
			})
			.filter((item): item is { meta: PostMeta; mtime: number } => item !== null);
		
		// 排序：先按日期降序，日期相同則按文件修改時間降序，最後按 slug 降序
		return postsWithStats
			.sort((a, b) => {
				const dateA = new Date(a.meta.date).getTime();
				const dateB = new Date(b.meta.date).getTime();
				
				// 首先按日期降序排序
				if (dateA !== dateB) {
					return dateB - dateA; // 降序：新的在前
				}
				
				// 日期相同，按文件修改時間降序排序
				if (a.mtime !== b.mtime) {
					return b.mtime - a.mtime; // 降序：新的在前
				}
				
				// 如果都相同，按 slug 降序排序（確保穩定排序）
				return b.meta.slug.localeCompare(a.meta.slug);
			})
			.map((item) => item.meta);
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
	const postsWithStats = slugs
		.map((slug) => {
			const meta = getPostMeta(slug, lang);
			if (!meta) return null;
			
			// 獲取文件修改時間作為次要排序鍵
			const filePath = path.join(META_DIR, `${slug}.json`);
			if (!fs.existsSync(filePath)) return null;
			const stats = fs.statSync(filePath);
			
			return {
				meta,
				mtime: stats.mtime.getTime() // 文件修改時間（毫秒）
			};
		})
		.filter((item): item is { meta: PostMeta; mtime: number } => item !== null);
	
	// 排序：先按日期降序，日期相同則按文件修改時間降序，最後按 slug 降序
	return postsWithStats
		.sort((a, b) => {
			const dateA = new Date(a.meta.date).getTime();
			const dateB = new Date(b.meta.date).getTime();
			
			// 首先按日期降序排序
			if (dateA !== dateB) {
				return dateB - dateA; // 降序：新的在前
			}
			
			// 日期相同，按文件修改時間降序排序
			if (a.mtime !== b.mtime) {
				return b.mtime - a.mtime; // 降序：新的在前
			}
			
			// 如果都相同，按 slug 降序排序（確保穩定排序）
			return b.meta.slug.localeCompare(a.meta.slug);
		})
		.map((item) => item.meta);
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


