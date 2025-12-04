<script lang="ts">
	import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';
	import { page } from '$app/stores';
	import { parseLanguage } from '$lib/utils/language';
	import { onMount } from 'svelte';

	let { children } = $props();
	
	import { buildLangPath } from '$lib/utils/language';
	
	// 使用 $derived 来响应式地获取语言
	const lang = $derived(parseLanguage($page.url));

	// 滚动状态
	let scrolled = $state(false);
	let navElement: HTMLElement;
	
	// 移动端菜单状态
	let mobileMenuOpen = $state(false);

	onMount(() => {
		const handleScroll = () => {
			scrolled = window.scrollY > 20;
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		handleScroll(); // 初始检查

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});
	
	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}
	
	function closeMobileMenu() {
		mobileMenuOpen = false;
	}
</script>

<svelte:head>
	<link rel="icon" type="image/png" href="/images/vibeblog-icon.png" />
	<link rel="sitemap" type="application/xml" href="/sitemap.xml" />
</svelte:head>

<nav class="main-nav" class:scrolled bind:this={navElement}>
	<div class="nav-container">
		<a href={buildLangPath('/', lang)} class="logo">VibeBlog</a>
		<button class="mobile-menu-toggle" class:active={mobileMenuOpen} onclick={toggleMobileMenu} aria-label={lang === 'en' ? 'Toggle menu' : '切換選單'}>
			<span class="hamburger-line"></span>
			<span class="hamburger-line"></span>
			<span class="hamburger-line"></span>
		</button>
		<div class="nav-links" class:mobile-open={mobileMenuOpen}>
			<a href={buildLangPath('/', lang)} class:active={$page.url.pathname === '/' || $page.url.pathname === '/en' || $page.url.pathname === '/en/'} onclick={closeMobileMenu}>{lang === 'en' ? 'Home' : '首頁'}</a>
			<a href={buildLangPath('/blog', lang)} class:active={$page.url.pathname.startsWith('/blog') || $page.url.pathname.startsWith('/en/blog')} onclick={closeMobileMenu}>{lang === 'en' ? 'Posts' : '文章'}</a>
			<a href={buildLangPath('/tags', lang)} class:active={$page.url.pathname.startsWith('/tags') || $page.url.pathname.startsWith('/en/tags')} onclick={closeMobileMenu}>{lang === 'en' ? 'Tags' : '標籤'}</a>
			<LanguageSwitcher />
		</div>
		{#if mobileMenuOpen}
			<div class="mobile-menu-overlay" onclick={closeMobileMenu}></div>
		{/if}
	</div>
</nav>

<main>
	{@render children()}
</main>

<style>
	.main-nav {
		position: sticky;
		top: 0;
		z-index: 1000;
		background: rgba(255, 255, 255, 0.8);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		border-bottom: 1px solid transparent;
		padding: 1.25rem 0;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		margin-bottom: 0;
	}

	.main-nav.scrolled {
		background: rgba(255, 255, 255, 0.95);
		box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
		border-bottom-color: rgba(0, 0, 0, 0.08);
		padding: 0.875rem 0;
	}

	.nav-container {
		max-width: 1400px;
		margin: 0 auto;
		padding: 0 2rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		transition: padding 0.3s ease;
	}

	.main-nav.scrolled .nav-container {
		padding: 0 2rem;
	}

	.logo {
		font-size: 1.75rem;
		font-weight: 700;
		color: #1a1a1a;
		text-decoration: none;
		transition: all 0.3s ease;
		letter-spacing: -0.02em;
		background: linear-gradient(135deg, #0066cc 0%, #0052a3 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.logo:hover {
		transform: scale(1.05);
	}

	.main-nav.scrolled .logo {
		font-size: 1.5rem;
	}

	.nav-links {
		display: flex;
		gap: 2.5rem;
		align-items: center;
	}

	.nav-links a {
		color: #555;
		text-decoration: none;
		font-weight: 500;
		font-size: 1rem;
		position: relative;
		transition: color 0.3s ease;
		padding: 0.5rem 0;
	}

	.nav-links a::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		width: 0;
		height: 2px;
		background: linear-gradient(135deg, #0066cc 0%, #0052a3 100%);
		transition: width 0.3s ease;
	}

	.nav-links a:hover {
		color: #0066cc;
	}

	.nav-links a:hover::after,
	.nav-links a.active::after {
		width: 100%;
	}

	.nav-links a.active {
		color: #0066cc;
		font-weight: 600;
	}

	/* 移动端菜单按钮 */
	.mobile-menu-toggle {
		display: none;
		flex-direction: column;
		justify-content: space-around;
		width: 2rem;
		height: 2rem;
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 0;
		z-index: 1001;
	}

	.hamburger-line {
		width: 2rem;
		height: 0.25rem;
		background: #1a1a1a;
		border-radius: 10px;
		transition: all 0.3s ease;
		transform-origin: center;
	}

	.mobile-menu-toggle:hover .hamburger-line {
		background: #0066cc;
	}

	.mobile-menu-overlay {
		display: none;
	}

	main {
		min-height: calc(100vh - 200px);
	}

	/* 移动端响应式 */
	@media (max-width: 768px) {
		.nav-container {
			padding: 0 1.5rem;
		}

		.logo {
			font-size: 1.5rem;
		}

		.main-nav.scrolled .logo {
			font-size: 1.25rem;
		}

		.mobile-menu-toggle {
			display: flex;
		}

		.nav-links {
			position: fixed;
			top: 0;
			right: -100%;
			width: 280px;
			height: 100vh;
			background: white;
			flex-direction: column;
			align-items: flex-start;
			padding: 5rem 2rem 2rem;
			gap: 0;
			box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
			transition: right 0.3s ease;
			z-index: 1000;
		}

		.nav-links.mobile-open {
			right: 0;
		}

		.nav-links a {
			width: 100%;
			padding: 1rem 0;
			font-size: 1.1rem;
			border-bottom: 1px solid #f0f0f0;
		}

		.nav-links a::after {
			display: none;
		}

		.nav-links a.active {
			border-left: 4px solid #0066cc;
			padding-left: 1rem;
		}

		.mobile-menu-overlay {
			display: block;
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, 0.5);
			z-index: 999;
		}

		/* 漢堡選單動畫 */
		.mobile-menu-toggle.active .hamburger-line:nth-child(1) {
			transform: rotate(45deg) translate(0.5rem, 0.5rem);
		}

		.mobile-menu-toggle.active .hamburger-line:nth-child(2) {
			opacity: 0;
		}

		.mobile-menu-toggle.active .hamburger-line:nth-child(3) {
			transform: rotate(-45deg) translate(0.5rem, -0.5rem);
		}
	}

	@media (max-width: 480px) {
		.nav-container {
			padding: 0 1rem;
		}

		.nav-links {
			width: 100%;
			right: -100%;
		}

		.nav-links.mobile-open {
			right: 0;
		}
	}
</style>
