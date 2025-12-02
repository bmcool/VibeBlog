import type { Language } from '$lib/types/blog';

/**
 * 解析語言參數（從 URL）
 * 客戶端安全版本，不依賴 Node.js 模組
 */
export function parseLanguage(url: URL): Language {
	const langParam = url.searchParams.get('lang');
	if (langParam === 'en' || langParam === 'zh') {
		return langParam;
	}
	return 'zh'; // 默認中文
}

