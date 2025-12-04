<script lang="ts">
	import type { PageData } from './$types';
	import { generateSEOTags, generateStructuredData, buildLangPath } from '$lib/utils/seo';
	
	let { data }: { data: PageData } = $props();
	
	// 根路由只处理中文版本
	const lang = 'zh';
	
	// SEO 数据
	const seo = $derived(generateSEOTags({
		title: 'VibeBlog - AI、開發工具與技術見解',
		description: '分享 AI、開發工具與技術見解的技術部落格。探索關於 MCP servers、自動化和現代開發實踐的文章。',
		url: '/',
		type: 'website',
		lang
	}));
	
	const structuredData = $derived(generateStructuredData({
		title: seo.title,
		description: seo.description,
		url: seo.url,
		type: 'website',
		lang
	}));
</script>

<svelte:head>
	<title>{seo.title}</title>
	<meta name="description" content={seo.description} />
	<meta name="keywords" content={lang === 'en' ? 'AI, development tools, technology, MCP servers, automation, blog' : 'AI, 開發工具, 技術, MCP servers, 自動化, 部落格'} />
	
	<!-- Open Graph -->
	<meta property="og:title" content={seo.title} />
	<meta property="og:description" content={seo.description} />
	<meta property="og:image" content={seo.image} />
	<meta property="og:url" content={seo.url} />
	<meta property="og:type" content={seo.type} />
	<meta property="og:site_name" content="VibeBlog" />
	<meta property="og:locale" content={lang === 'en' ? 'en_US' : 'zh_TW'} />
	{#if lang === 'en'}
		<meta property="og:locale:alternate" content="zh_TW" />
	{:else}
		<meta property="og:locale:alternate" content="en_US" />
	{/if}
	
	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={seo.title} />
	<meta name="twitter:description" content={seo.description} />
	<meta name="twitter:image" content={seo.image} />
	
	<!-- Canonical URL -->
	<link rel="canonical" href={seo.url} />
	
	<!-- Alternate Languages -->
	<link rel="alternate" hreflang="zh-TW" href="https://vibeblog.app/" />
	<link rel="alternate" hreflang="en-US" href="https://vibeblog.app/en/" />
	<link rel="alternate" hreflang="x-default" href="https://vibeblog.app/" />
	
	<!-- Structured Data -->
	{@html `<script type="application/ld+json">${JSON.stringify(structuredData)}</script>`}
</svelte:head>

<div class="home-container">
	<!-- Hero Section with Background Image -->
	<header class="hero" style="background-image: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/images/homepage-hero.png');">
		<div class="hero-content">
			<h1>VibeBlog</h1>
			<p class="subtitle">分享 AI、開發工具與技術見解</p>
			<div class="hero-actions">
				<a href="/blog" class="btn btn-primary">探索文章</a>
				<a href="/tags" class="btn btn-secondary">瀏覽標籤</a>
			</div>
		</div>
	</header>

	<!-- Latest Posts Section -->
	{#if data.latestPosts && data.latestPosts.length > 0}
		<section class="latest-posts">
			<h2>最新文章</h2>
			<div class="posts-grid">
				{#each data.latestPosts as post (post.slug)}
					<article class="post-card">
						{#if post.heroImage}
							<div class="post-image-wrapper">
								<img src={post.heroImage} alt={post.title} class="post-image" />
							</div>
						{/if}
						<div class="post-content">
							<h3><a href={`/blog/${post.slug}`}>{post.title}</a></h3>
							<p class="post-date">{new Date(post.date).toLocaleDateString('zh-TW')}</p>
							{#if post.summary}
								<p class="post-description">{post.summary}</p>
							{:else if post.description}
								<p class="post-description">{post.description}</p>
							{/if}
							{#if post.tags && post.tags.length > 0}
								<div class="post-tags">
									{#each post.tags.slice(0, 3) as tag}
										<span class="tag">{tag}</span>
									{/each}
								</div>
							{/if}
							<a href={`/blog/${post.slug}`} class="read-more">閱讀全文 →</a>
						</div>
					</article>
				{/each}
			</div>
		</section>
	{/if}

	<!-- Popular Tags Section -->
	{#if data.popularTags && data.popularTags.length > 0}
		<section class="popular-tags">
			<h2>熱門主題</h2>
			<div class="tags-cloud">
				{#each data.popularTags as tag}
					<a href={`/tags/${encodeURIComponent(tag)}`} class="tag-link">{tag}</a>
				{/each}
			</div>
		</section>
	{/if}

	<!-- Call to Action -->
	<nav class="cta">
		<a href="/blog" class="btn btn-large">查看所有文章</a>
	</nav>
</div>

<style>
	.home-container {
		max-width: 1400px;
		margin: 0 auto;
		padding: 0;
	}

	/* Hero Section */
	.hero {
		position: relative;
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		min-height: 60vh;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		color: white;
		margin-bottom: 4rem;
	}

	.hero-content {
		max-width: 800px;
		padding: 2rem;
		z-index: 1;
	}

	.hero h1 {
		font-size: 4rem;
		font-weight: 700;
		margin: 0 0 1.5rem 0;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
		letter-spacing: -0.02em;
	}

	.subtitle {
		font-size: 1.5rem;
		margin: 0 0 2.5rem 0;
		opacity: 0.95;
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
	}

	.hero-actions {
		display: flex;
		gap: 1rem;
		justify-content: center;
		flex-wrap: wrap;
	}

	.btn {
		display: inline-block;
		padding: 0.875rem 2rem;
		border-radius: 8px;
		text-decoration: none;
		font-weight: 600;
		transition: all 0.3s ease;
		font-size: 1rem;
	}

	.btn-primary {
		background: #0066cc;
		color: white;
		box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
	}

	.btn-primary:hover {
		background: #0052a3;
		transform: translateY(-2px);
		box-shadow: 0 6px 16px rgba(0, 102, 204, 0.4);
	}

	.btn-secondary {
		background: rgba(255, 255, 255, 0.2);
		color: white;
		border: 2px solid white;
		backdrop-filter: blur(10px);
	}

	.btn-secondary:hover {
		background: rgba(255, 255, 255, 0.3);
		transform: translateY(-2px);
	}

	.btn-large {
		padding: 1rem 3rem;
		font-size: 1.1rem;
	}

	/* Latest Posts Section */
	.latest-posts {
		padding: 0 2rem 4rem;
	}

	.latest-posts h2 {
		font-size: 2.5rem;
		margin-bottom: 2.5rem;
		color: #1a1a1a;
		text-align: center;
		font-weight: 700;
	}

	.posts-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
		gap: 2rem;
		margin-bottom: 2rem;
	}

	.post-card {
		background: white;
		border-radius: 12px;
		overflow: hidden;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		transition: all 0.3s ease;
		display: flex;
		flex-direction: column;
	}

	.post-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
	}

	.post-image-wrapper {
		width: 100%;
		height: 200px;
		overflow: hidden;
		background: #f0f0f0;
	}

	.post-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.3s ease;
	}

	.post-card:hover .post-image {
		transform: scale(1.05);
	}

	.post-content {
		padding: 1.5rem;
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.post-content h3 {
		margin: 0 0 0.75rem 0;
		font-size: 1.5rem;
		line-height: 1.3;
	}

	.post-content h3 a {
		color: #1a1a1a;
		text-decoration: none;
		transition: color 0.2s;
	}

	.post-content h3 a:hover {
		color: #0066cc;
	}

	.post-date {
		color: #666;
		font-size: 0.9rem;
		margin: 0 0 1rem 0;
	}

	.post-description {
		color: #555;
		line-height: 1.6;
		margin: 0 0 1.25rem 0;
		flex: 1;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.post-tags {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
		margin-bottom: 1rem;
	}

	.tag {
		display: inline-block;
		padding: 0.25rem 0.75rem;
		background: #f0f0f0;
		color: #555;
		border-radius: 20px;
		font-size: 0.85rem;
	}

	.read-more {
		color: #0066cc;
		text-decoration: none;
		font-weight: 600;
		margin-top: auto;
		transition: color 0.2s;
	}

	.read-more:hover {
		color: #0052a3;
		text-decoration: underline;
	}

	/* Popular Tags Section */
	.popular-tags {
		padding: 3rem 2rem;
		background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
		margin: 4rem 0;
	}

	.popular-tags h2 {
		font-size: 2.5rem;
		margin-bottom: 2rem;
		color: #1a1a1a;
		text-align: center;
		font-weight: 700;
	}

	.tags-cloud {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		justify-content: center;
		max-width: 1000px;
		margin: 0 auto;
	}

	.tag-link {
		display: inline-block;
		padding: 0.75rem 1.5rem;
		background: white;
		color: #333;
		text-decoration: none;
		border-radius: 25px;
		font-weight: 500;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		transition: all 0.3s ease;
	}

	.tag-link:hover {
		background: #0066cc;
		color: white;
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
	}

	/* CTA Section */
	.cta {
		text-align: center;
		padding: 3rem 2rem;
	}

	/* Responsive Design */
	@media (max-width: 768px) {
		.hero {
			min-height: 50vh;
			margin-bottom: 3rem;
		}

		.hero-content {
			padding: 1.5rem;
		}

		.hero h1 {
			font-size: 2.5rem;
			margin-bottom: 1rem;
		}

		.subtitle {
			font-size: 1.2rem;
			margin: 0 0 2rem 0;
		}

		.hero-actions {
			flex-direction: column;
			align-items: center;
			gap: 0.75rem;
		}

		.btn {
			width: 100%;
			max-width: 300px;
			padding: 0.75rem 1.5rem;
		}

		.latest-posts {
			padding: 0 1rem 3rem;
		}

		.latest-posts h2 {
			font-size: 2rem;
			margin-bottom: 2rem;
		}

		.posts-grid {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}

		.post-content {
			padding: 1.25rem;
		}

		.post-content h3 {
			font-size: 1.25rem;
		}

		.popular-tags {
			padding: 2rem 1rem;
			margin: 3rem 0;
		}

		.popular-tags h2 {
			font-size: 2rem;
			margin-bottom: 1.5rem;
		}

		.tags-cloud {
			gap: 0.75rem;
		}

		.tag-link {
			padding: 0.625rem 1.25rem;
			font-size: 0.9rem;
		}

		.cta {
			padding: 2rem 1rem;
		}

		.btn-large {
			padding: 0.875rem 2rem;
			font-size: 1rem;
		}
	}

	@media (max-width: 480px) {
		.hero {
			min-height: 40vh;
			margin-bottom: 2rem;
		}

		.hero-content {
			padding: 1rem;
		}

		.hero h1 {
			font-size: 2rem;
			margin-bottom: 0.75rem;
		}

		.subtitle {
			font-size: 1rem;
			margin: 0 0 1.5rem 0;
		}

		.btn {
			padding: 0.625rem 1.25rem;
			font-size: 0.95rem;
		}

		.latest-posts {
			padding: 0 0.75rem 2rem;
		}

		.latest-posts h2 {
			font-size: 1.75rem;
			margin-bottom: 1.5rem;
		}

		.posts-grid {
			gap: 1.25rem;
		}

		.post-content {
			padding: 1rem;
		}

		.post-content h3 {
			font-size: 1.1rem;
		}

		.post-description {
			font-size: 0.9rem;
		}

		.popular-tags {
			padding: 1.5rem 0.75rem;
			margin: 2rem 0;
		}

		.popular-tags h2 {
			font-size: 1.75rem;
			margin-bottom: 1.25rem;
		}

		.tags-cloud {
			gap: 0.5rem;
		}

		.tag-link {
			padding: 0.5rem 1rem;
			font-size: 0.85rem;
		}

		.cta {
			padding: 1.5rem 0.75rem;
		}

		.btn-large {
			padding: 0.75rem 1.5rem;
			font-size: 0.95rem;
		}
	}
</style>
