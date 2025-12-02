import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { PostMeta, TagsIndex } from '../src/lib/types/blog.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const META_DIR = path.join(__dirname, '../content/meta');
const INDEXES_DIR = path.join(__dirname, '../content/indexes');

/**
 * 生成 tags.json 索引文件
 * 掃描所有 meta JSON 文件，建立 tag -> slugs 的映射
 */
function generateTagsIndex(): void {
	console.log('🔍 掃描文章 metadata...');

	if (!fs.existsSync(META_DIR)) {
		console.warn(`⚠️  Meta 目錄不存在: ${META_DIR}`);
		fs.mkdirSync(META_DIR, { recursive: true });
		return;
	}

	const files = fs.readdirSync(META_DIR);
	const jsonFiles = files.filter((f) => f.endsWith('.json'));

	if (jsonFiles.length === 0) {
		console.warn('⚠️  沒有找到任何 meta JSON 文件');
		return;
	}

	const tagsIndexZh: TagsIndex = {};
	const tagsIndexEn: TagsIndex = {};

	// 讀取所有 meta 文件
	for (const file of jsonFiles) {
		try {
			const filePath = path.join(META_DIR, file);
			const raw = fs.readFileSync(filePath, 'utf-8');
			const meta = JSON.parse(raw) as PostMeta;

			if (!meta.slug) {
				console.warn(`⚠️  跳過無效的 meta 文件: ${file} (缺少 slug)`);
				continue;
			}

			// 將文章 slug 加入對應的中文 tag
			if (meta.tags && Array.isArray(meta.tags)) {
				for (const tag of meta.tags) {
					if (!tagsIndexZh[tag]) {
						tagsIndexZh[tag] = [];
					}
					if (!tagsIndexZh[tag].includes(meta.slug)) {
						tagsIndexZh[tag].push(meta.slug);
					}
				}
			}

			// 將文章 slug 加入對應的英文 tag
			if (meta.tagsEn && Array.isArray(meta.tagsEn)) {
				for (const tag of meta.tagsEn) {
					if (!tagsIndexEn[tag]) {
						tagsIndexEn[tag] = [];
					}
					if (!tagsIndexEn[tag].includes(meta.slug)) {
						tagsIndexEn[tag].push(meta.slug);
					}
				}
			}
		} catch (error) {
			console.error(`❌ 讀取 meta 文件失敗: ${file}`, error);
		}
	}

	// 確保 indexes 目錄存在
	if (!fs.existsSync(INDEXES_DIR)) {
		fs.mkdirSync(INDEXES_DIR, { recursive: true });
	}

	// 寫入 tags.json (中文)
	const indexPathZh = path.join(INDEXES_DIR, 'tags.json');
	fs.writeFileSync(indexPathZh, JSON.stringify(tagsIndexZh, null, 2), 'utf-8');

	// 寫入 tags.en.json (英文)
	const indexPathEn = path.join(INDEXES_DIR, 'tags.en.json');
	fs.writeFileSync(indexPathEn, JSON.stringify(tagsIndexEn, null, 2), 'utf-8');

	const tagCountZh = Object.keys(tagsIndexZh).length;
	const tagCountEn = Object.keys(tagsIndexEn).length;
	const totalPosts = new Set(
		[...Object.values(tagsIndexZh), ...Object.values(tagsIndexEn)].flatMap((slugs) => slugs)
	).size;

	console.log(`✅ 成功生成標籤索引`);
	console.log(`   - 中文標籤數量: ${tagCountZh}`);
	console.log(`   - 英文標籤數量: ${tagCountEn}`);
	console.log(`   - 文章數量: ${totalPosts}`);
	console.log(`   - 輸出位置: ${indexPathZh}`);
	console.log(`   - 輸出位置: ${indexPathEn}`);
}

// 執行
generateTagsIndex();


