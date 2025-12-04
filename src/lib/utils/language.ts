import type { Language } from '$lib/types/blog';

/**
 * 解析語言參數（從 URL）
 * 客戶端安全版本，不依賴 Node.js 模組
 * 支持 prerender 模式
 */
export function parseLanguage(url: URL): Language {
	try {
		// 在 prerender 时，searchParams 可能不可用
		if (url.searchParams) {
			const langParam = url.searchParams.get('lang');
			if (langParam === 'en' || langParam === 'zh') {
				return langParam;
			}
		}
		// 如果 searchParams 不可用，尝试从 search 字符串解析
		if (url.search) {
			const params = new URLSearchParams(url.search);
			const langParam = params.get('lang');
			if (langParam === 'en' || langParam === 'zh') {
				return langParam;
			}
		}
	} catch (e) {
		// 如果访问 searchParams 失败，返回默认语言
	}
	return 'zh'; // 默認中文
}

