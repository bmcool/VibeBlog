<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import type { Language } from '$lib/types/blog';
	import { parseLanguage, buildLangPath } from '$lib/utils/language';
	
	// 使用 $derived 来响应式地获取当前语言（从路径解析）
	const currentLang = $derived(parseLanguage($page.url));
	
	function switchLanguage(lang: Language) {
		const currentPath = $page.url.pathname;
		
		// 移除当前语言前缀（如果有）
		let pathWithoutLang = currentPath;
		if (currentPath.startsWith('/en/')) {
			pathWithoutLang = currentPath.slice(4); // 移除 '/en/'
		} else if (currentPath === '/en') {
			pathWithoutLang = '/';
		} else if (currentPath.startsWith('/en')) {
			pathWithoutLang = currentPath.slice(3); // 移除 '/en'
		}
		
		// 确保路径以 / 开头
		if (!pathWithoutLang.startsWith('/')) {
			pathWithoutLang = '/' + pathWithoutLang;
		}
		
		// 构建新路径
		const newPath = buildLangPath(pathWithoutLang, lang);
		goto(newPath, { invalidateAll: true });
	}
</script>

<div class="language-switcher">
	<button
		class:active={currentLang === 'zh'}
		onclick={() => switchLanguage('zh')}
		aria-label="切換到中文"
	>
		中文
	</button>
	<span class="separator">|</span>
	<button
		class:active={currentLang === 'en'}
		onclick={() => switchLanguage('en')}
		aria-label="Switch to English"
	>
		English
	</button>
</div>

<style>
	.language-switcher {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.language-switcher button {
		background: none;
		border: none;
		color: #666;
		cursor: pointer;
		font-size: 0.9rem;
		padding: 0.25rem 0.5rem;
		transition: color 0.2s;
	}

	.language-switcher button:hover {
		color: #0066cc;
	}

	.language-switcher button.active {
		color: #0066cc;
		font-weight: 600;
	}

	.separator {
		color: #ccc;
	}
</style>

