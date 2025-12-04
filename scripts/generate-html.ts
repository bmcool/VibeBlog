import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RAW_DIR = path.join(__dirname, '../content/raw');
const PROCESSED_DIR = path.join(__dirname, '../content/processed');

// 确保 processed 目录存在
if (!fs.existsSync(PROCESSED_DIR)) {
	fs.mkdirSync(PROCESSED_DIR, { recursive: true });
}

// 获取所有 markdown 文件
const files = fs.readdirSync(RAW_DIR).filter(file => file.endsWith('.md'));

console.log(`📝 找到 ${files.length} 个 markdown 文件\n`);

for (const file of files) {
	const inputPath = path.join(RAW_DIR, file);
	const content = fs.readFileSync(inputPath, 'utf-8');
	
	// 生成 HTML
	let html = marked.parse(content);
	
	// 移除文章开头的第一个图片（避免与 top image 重复）
	// 匹配在第一个或第二个标题（h1/h2）之后的第一个图片
	// 支持多种格式：<p><img></p> 或 <img> 或换行后的图片
	html = html.replace(
		/(<h[12]>[^<]*<\/h[12]>[\s\n]*)+<p>\s*<img[^>]*>[\s\n]*<\/p>/i,
		(match) => {
			// 只保留标题部分，移除图片段落
			return match.replace(/<p>\s*<img[^>]*>[\s\n]*<\/p>/i, '');
		}
	);
	
	// 如果图片在第一个段落中（没有标题的情况），也移除
	html = html.replace(
		/^(<p>)\s*<img[^>]*>[\s\n]*(<\/p>)/i,
		''
	);
	
	// 为所有外部链接添加 target="_blank" rel="noopener noreferrer"
	// 匹配 <a href="http..." 或 <a href="https..." 的链接
	html = html.replace(
		/<a href="(https?:\/\/[^"]+)"/g,
		'<a href="$1" target="_blank" rel="noopener noreferrer"'
	);
	
	// 输出文件名：将 .md 替换为 .html
	const outputFileName = file.replace(/\.md$/, '.html');
	const outputPath = path.join(PROCESSED_DIR, outputFileName);
	
	fs.writeFileSync(outputPath, html, 'utf-8');
	console.log(`✅ 已生成: ${outputFileName}`);
}

console.log(`\n✨ 完成！已处理 ${files.length} 个文件`);
