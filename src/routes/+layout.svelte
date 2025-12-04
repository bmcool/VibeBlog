<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
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
</script>

<svelte:head>
	<link rel="icon" type="image/png" href="/images/vibeblog-icon.png" />
	<link rel="sitemap" type="application/xml" href="/sitemap.xml" />
</svelte:head>

<nav class="main-nav" class:scrolled bind:this={navElement}>
	<div class="nav-container">
		<a href={buildLangPath('/', lang)} class="logo">VibeBlog</a>
		<div class="nav-links">
			<a href={buildLangPath('/blog', lang)} class:active={$page.url.pathname.startsWith('/blog') || $page.url.pathname.startsWith('/en/blog')}>{lang === 'en' ? 'Posts' : '文章'}</a>
			<a href={buildLangPath('/tags', lang)} class:active={$page.url.pathname.startsWith('/tags') || $page.url.pathname.startsWith('/en/tags')}>{lang === 'en' ? 'Tags' : '標籤'}</a>
		</div>
	</div>
</nav>

<main>
	{@render children()}
</main>

<Footer />

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

		.nav-links {
			gap: 1.5rem;
		}

		.nav-links a {
			font-size: 0.9rem;
		}
	}

	@media (max-width: 480px) {
		.nav-container {
			padding: 0 1rem;
		}

		.nav-links {
			gap: 1rem;
		}

		.nav-links a {
			font-size: 0.85rem;
		}
	}
</style>
