<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import type { Language } from '$lib/types/blog';
	
	// 使用 $derived 来响应式地获取当前语言
	const currentLang = $derived((): Language => {
		const langParam = $page.url.searchParams.get('lang');
		return (langParam === 'en' || langParam === 'zh') ? langParam : 'zh';
	});
	
	function switchLanguage(lang: Language) {
		const url = new URL($page.url);
		if (lang === 'zh') {
			url.searchParams.delete('lang');
		} else {
			url.searchParams.set('lang', lang);
		}
		goto(url.toString(), { invalidateAll: true });
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

