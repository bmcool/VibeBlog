import type { Language } from '$lib/types/blog';

/**
 * 解析語言（從 URL 路徑）
 * 支持路徑方式：/en/ 為英文，/ 為中文（默認）
 */
export function parseLanguage(url: URL, params?: { lang?: string }): Language {
	// 優先從路由參數解析（如果有的話）
	if (params?.lang) {
		if (params.lang === 'en' || params.lang === 'zh') {
			return params.lang;
		}
	}
	
	// 從路徑解析：/en/ 開頭為英文
	const pathname = url.pathname;
	if (pathname.startsWith('/en/') || pathname === '/en' || pathname.startsWith('/en/')) {
		return 'en';
	}
	
	// 默認返回中文
	return 'zh';
}

/**
 * 獲取語言路徑前綴
 * @param lang 語言
 * @returns 路徑前綴，中文返回空字符串，英文返回 '/en'
 */
export function getLangPath(lang: Language): string {
	return lang === 'en' ? '/en' : '';
}

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

