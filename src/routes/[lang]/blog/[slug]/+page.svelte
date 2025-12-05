<script lang="ts">
	import type { PageData } from './$types';
	import { generateSEOTags, generateStructuredData, buildLangPath } from '$lib/utils/seo';

	let { data }: { data: PageData } = $props();
	
	// SEO 数据
	const seo = $derived(generateSEOTags({
		title: data.post.title,
		description: data.post.summary || data.post.description || '',
		image: data.post.heroImage,
		url: buildLangPath(`/blog/${data.post.slug}`, data.lang),
		type: 'article',
		publishedTime: data.post.date,
		modifiedTime: data.post.modifiedTime || data.post.date,
		tags: data.post.tags || [],
		lang: data.lang
	}));
	
	const structuredData = $derived(generateStructuredData({
		title: data.post.title,
		description: seo.description,
		image: seo.image,
		url: seo.url,
		type: 'article',
		publishedTime: data.post.date,
		modifiedTime: data.post.modifiedTime || data.post.date,
		tags: data.post.tags || [],
		lang: data.lang
	}));
</script>

<svelte:head>
	<title>{seo.title}</title>
	<meta name="description" content={seo.description} />
	<meta name="keywords" content={data.post.tags?.join(', ') || ''} />
	<meta name="author" content="VibeBlog" />
	<meta name="article:published_time" content={data.post.date} />
	<meta name="article:modified_time" content={data.post.modifiedTime || data.post.date} />
	{#if data.post.tags && data.post.tags.length > 0}
		{#each data.post.tags as tag}
			<meta name="article:tag" content={tag} />
		{/each}
	{/if}
	
	<!-- Open Graph -->
	<meta property="og:title" content={seo.title} />
	<meta property="og:description" content={seo.description} />
	<meta property="og:image" content={seo.image} />
	<meta property="og:url" content={seo.url} />
	<meta property="og:type" content="article" />
	<meta property="og:site_name" content="VibeBlog" />
	<meta property="og:locale" content={data.lang === 'en' ? 'en_US' : 'zh_TW'} />
	{#if data.lang === 'en'}
		<meta property="og:locale:alternate" content="zh_TW" />
	{:else}
		<meta property="og:locale:alternate" content="en_US" />
	{/if}
	<meta property="article:published_time" content={data.post.date} />
	<meta property="article:modified_time" content={data.post.modifiedTime || data.post.date} />
	
	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={seo.title} />
	<meta name="twitter:description" content={seo.description} />
	<meta name="twitter:image" content={seo.image} />
	
	<!-- Canonical URL -->
	<link rel="canonical" href={seo.url} />
	
	<!-- Alternate Languages -->
	<link rel="alternate" hreflang="zh-TW" href={`https://vibeblog.app/blog/${data.post.slug}`} />
	<link rel="alternate" hreflang="en-US" href={`https://vibeblog.app/en/blog/${data.post.slug}`} />
	<link rel="alternate" hreflang="x-default" href={`https://vibeblog.app/blog/${data.post.slug}`} />
	
	<!-- Structured Data -->
	{@html `<script type="application/ld+json">${JSON.stringify(structuredData)}</script>`}
</svelte:head>

<div class="post-container">
	<article class="post">
		<header class="post-header">
			<a href={buildLangPath('/blog', data.lang)} class="back-link">← {data.lang === 'en' ? 'Back to Posts' : '返回文章列表'}</a>
			<h1>{data.post.title}</h1>
			<p class="post-meta">
				<span class="date">{new Date(data.post.date).toLocaleDateString(data.lang === 'en' ? 'en-US' : 'zh-TW')}</span>
			</p>
			{#if data.post.tags && data.post.tags.length > 0}
				<div class="post-tags">
					{#each data.post.tags as tag}
						<a href={buildLangPath(`/tags/${encodeURIComponent(tag)}`, data.lang)} class="tag-badge">{tag}</a>
					{/each}
				</div>
			{/if}
		</header>

		{#if data.post.heroImage}
			<img src={data.post.heroImage} alt={data.post.title} class="post-featured-image" />
		{:else if data.post.image}
			<img src={data.post.image} alt={data.post.title} class="post-featured-image" />
		{/if}

		<div class="post-content">
			{@html data.post.htmlContent}
		</div>
	</article>
</div>

<style>
	.post-container {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
	}

	.post {
		background: white;
		border-radius: 8px;
		padding: 2rem;
	}

	.post-header {
		margin-bottom: 2rem;
	}

	.back-link {
		display: inline-block;
		margin-bottom: 1rem;
		color: #0066cc;
		text-decoration: none;
		font-size: 0.9rem;
	}

	.back-link:hover {
		text-decoration: underline;
	}

	.post-header h1 {
		font-size: 2.5rem;
		margin: 0 0 0.5rem 0;
		color: #333;
	}

	.post-meta {
		color: #666;
		font-size: 0.9rem;
		margin: 0 0 1rem 0;
	}

	.post-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.tag-badge {
		display: inline-block;
		padding: 0.25rem 0.75rem;
		background: #f0f0f0;
		border-radius: 12px;
		font-size: 0.85rem;
		color: #666;
		text-decoration: none;
		transition: all 0.2s;
	}

	.tag-badge:hover {
		background: #0066cc;
		color: white;
	}

	.post-featured-image {
		width: 100%;
		max-width: 100%;
		height: auto;
		border-radius: 8px;
		margin-bottom: 2rem;
	}

	.post-content {
		line-height: 1.8;
		color: #333;
	}

	.post-content :global(h1),
	.post-content :global(h2),
	.post-content :global(h3) {
		margin-top: 2rem;
		margin-bottom: 1rem;
		color: #333;
	}

	.post-content :global(h1) {
		font-size: 2rem;
	}

	.post-content :global(h2) {
		font-size: 1.5rem;
	}

	.post-content :global(h3) {
		font-size: 1.25rem;
	}

	.post-content :global(p) {
		margin-bottom: 1rem;
	}

	.post-content :global(ul),
	.post-content :global(ol) {
		margin-bottom: 1rem;
		padding-left: 2rem;
	}

	.post-content :global(li) {
		margin-bottom: 0.5rem;
	}

	.post-content :global(img) {
		max-width: 100%;
		height: auto;
		border-radius: 8px;
		margin: 1rem 0;
	}

	.post-content :global(code) {
		background: #f4f4f4;
		padding: 0.2rem 0.4rem;
		border-radius: 3px;
		font-family: 'Courier New', monospace;
		font-size: 0.9em;
	}

	.post-content :global(pre) {
		background: #f4f4f4;
		padding: 1rem;
		border-radius: 5px;
		overflow-x: auto;
		margin-bottom: 1rem;
	}

	.post-content :global(blockquote) {
		border-left: 4px solid #0066cc;
		padding-left: 1rem;
		margin: 1rem 0;
		color: #666;
		font-style: italic;
	}

	/* Responsive Design */
	@media (max-width: 768px) {
		.post-container {
			padding: 1.5rem;
		}

		.post {
			padding: 1.5rem;
		}

		.post-header h1 {
			font-size: 2rem;
		}

		.post-content :global(h1) {
			font-size: 1.75rem;
		}

		.post-content :global(h2) {
			font-size: 1.5rem;
		}

		.post-content :global(h3) {
			font-size: 1.25rem;
		}

		.post-content :global(ul),
		.post-content :global(ol) {
			padding-left: 1.5rem;
		}
	}

	@media (max-width: 480px) {
		.post-container {
			padding: 1rem;
		}

		.post {
			padding: 1.25rem;
			border-radius: 0;
		}

		.post-header {
			margin-bottom: 1.5rem;
		}

		.post-header h1 {
			font-size: 1.75rem;
			line-height: 1.3;
		}

		.post-meta {
			font-size: 0.85rem;
		}

		.tag-badge {
			padding: 0.2rem 0.6rem;
			font-size: 0.8rem;
		}

		.post-content {
			font-size: 0.95rem;
			line-height: 1.7;
		}

		.post-content :global(h1) {
			font-size: 1.5rem;
			margin-top: 1.5rem;
		}

		.post-content :global(h2) {
			font-size: 1.25rem;
			margin-top: 1.5rem;
		}

		.post-content :global(h3) {
			font-size: 1.1rem;
			margin-top: 1.25rem;
		}

		.post-content :global(ul),
		.post-content :global(ol) {
			padding-left: 1.25rem;
		}

		.post-content :global(pre) {
			padding: 0.75rem;
			font-size: 0.85rem;
		}

		.post-content :global(blockquote) {
			padding-left: 0.75rem;
			margin: 0.75rem 0;
		}
	}
</style>

