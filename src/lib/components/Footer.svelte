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
	
	const currentYear = new Date().getFullYear();
</script>

<footer class="footer">
	<div class="footer-container">
		<div class="footer-content">
			<!-- 品牌區塊 -->
			<div class="footer-section">
				<h3 class="footer-logo">VibeBlog</h3>
				<p class="footer-description">
					{currentLang === 'en' 
						? 'A blog about AI, development tools, and technology' 
						: '關於 AI、開發工具與技術的部落格'}
				</p>
			</div>
			
			<!-- 導航連結 -->
			<div class="footer-section">
				<h4 class="footer-title">{currentLang === 'en' ? 'Navigation' : '導航'}</h4>
				<nav class="footer-nav">
					<a href={buildLangPath('/', currentLang)} class="footer-link">
						{currentLang === 'en' ? 'Home' : '首頁'}
					</a>
					<a href={buildLangPath('/blog', currentLang)} class="footer-link">
						{currentLang === 'en' ? 'Posts' : '文章'}
					</a>
					<a href={buildLangPath('/tags', currentLang)} class="footer-link">
						{currentLang === 'en' ? 'Tags' : '標籤'}
					</a>
				</nav>
			</div>
			
			<!-- 語系切換 -->
			<div class="footer-section">
				<h4 class="footer-title">{currentLang === 'en' ? 'Language' : '語言'}</h4>
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
			</div>
		</div>
		
		<!-- 版權信息 -->
		<div class="footer-bottom">
			<p class="copyright">
				© {currentYear} VibeBlog. {currentLang === 'en' ? 'All rights reserved.' : '版權所有。'}
			</p>
		</div>
	</div>
</footer>

<style>
	.footer {
		background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
		border-top: 1px solid rgba(0, 0, 0, 0.08);
		margin-top: 4rem;
		padding: 3rem 0 1.5rem;
	}

	.footer-container {
		max-width: 1400px;
		margin: 0 auto;
		padding: 0 2rem;
	}

	.footer-content {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 2.5rem;
		margin-bottom: 2.5rem;
	}

	.footer-section {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.footer-logo {
		font-size: 1.5rem;
		font-weight: 700;
		margin: 0;
		background: linear-gradient(135deg, #0066cc 0%, #0052a3 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.footer-description {
		color: #666;
		font-size: 0.9rem;
		line-height: 1.6;
		margin: 0;
	}

	.footer-title {
		font-size: 1rem;
		font-weight: 600;
		color: #1a1a1a;
		margin: 0 0 0.5rem 0;
	}

	.footer-nav {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.footer-link {
		color: #666;
		text-decoration: none;
		font-size: 0.9rem;
		transition: color 0.2s ease;
	}

	.footer-link:hover {
		color: #0066cc;
	}

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
		transition: color 0.2s ease;
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

	.footer-bottom {
		border-top: 1px solid rgba(0, 0, 0, 0.08);
		padding-top: 1.5rem;
		text-align: center;
	}

	.copyright {
		color: #999;
		font-size: 0.85rem;
		margin: 0;
	}

	/* 移動端響應式 */
	@media (max-width: 768px) {
		.footer {
			padding: 2rem 0 1.5rem;
		}

		.footer-container {
			padding: 0 1.5rem;
		}

		.footer-content {
			grid-template-columns: 1fr;
			gap: 2rem;
			margin-bottom: 2rem;
		}

		.footer-nav {
			flex-direction: row;
			flex-wrap: wrap;
		}
	}

	@media (max-width: 480px) {
		.footer-container {
			padding: 0 1rem;
		}

		.footer-content {
			gap: 1.5rem;
		}
	}
</style>

