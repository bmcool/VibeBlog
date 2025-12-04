<script lang="ts">
	import type { PageData } from './$types';
	import { generateSEOTags, buildLangPath } from '$lib/utils/seo';

	let { data }: { data: PageData } = $props();
	
	// SEO 数据
	const seo = $derived(generateSEOTags({
		title: data.lang === 'en' ? `Tag: ${data.tag} - VibeBlog` : `標籤：${data.tag} - VibeBlog`,
		description: data.lang === 'en' 
			? `Browse all articles tagged with "${data.tag}" on VibeBlog. Find ${data.posts.length} article${data.posts.length !== 1 ? 's' : ''} about ${data.tag}.`
			: `瀏覽 VibeBlog 上標籤為「${data.tag}」的所有文章。找到 ${data.posts.length} 篇關於 ${data.tag} 的文章。`,
		url: buildLangPath(`/tags/${encodeURIComponent(data.tag)}`, data.lang),
		type: 'website',
		lang: data.lang
	}));
</script>

<svelte:head>
	<title>{seo.title}</title>
	<meta name="description" content={seo.description} />
	<meta name="keywords" content={data.tag} />
	
	<!-- Open Graph -->
	<meta property="og:title" content={seo.title} />
	<meta property="og:description" content={seo.description} />
	<meta property="og:url" content={seo.url} />
	<meta property="og:type" content="website" />
	
	<!-- Canonical URL -->
	<link rel="canonical" href={seo.url} />
	
	<!-- Alternate Languages -->
	<link rel="alternate" hreflang="zh-TW" href={`https://vibeblog.app/tags/${encodeURIComponent(data.tag)}`} />
	<link rel="alternate" hreflang="en-US" href={`https://vibeblog.app/en/tags/${encodeURIComponent(data.tag)}`} />
</svelte:head>

<div class="tag-posts-container">
	<h1>{data.lang === 'en' ? `Tag: ${data.tag}` : `標籤：${data.tag}`}</h1>

	{#if data.posts.length === 0}
		<p>{data.lang === 'en' ? 'No posts yet.' : '目前沒有文章。'}</p>
	{:else}
		<div class="posts-grid">
			{#each data.posts as post (post.slug)}
				<article class="post-card">
					{#if post.heroImage}
						<img src={post.heroImage} alt={post.title} class="post-image" />
					{/if}
					<div class="post-content">
						<h2><a href={buildLangPath(`/blog/${post.slug}`, data.lang)}>{post.title}</a></h2>
						<p class="post-date">{new Date(post.date).toLocaleDateString(data.lang === 'en' ? 'en-US' : 'zh-TW')}</p>
						{#if post.summary}
							<p class="post-summary">{post.summary}</p>
						{/if}
						<div class="post-tags">
							{#each post.tags as tagItem}
								<a href={buildLangPath(`/tags/${encodeURIComponent(tagItem)}`, data.lang)} class="tag-badge">{tagItem}</a>
							{/each}
						</div>
						<a href={buildLangPath(`/blog/${post.slug}`, data.lang)} class="read-more">{data.lang === 'en' ? 'Read more →' : '閱讀更多 →'}</a>
					</div>
				</article>
			{/each}
		</div>
	{/if}
</div>

<style>
	.tag-posts-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}

	h1 {
		font-size: 2.5rem;
		margin-bottom: 2rem;
		color: #333;
	}

	.posts-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 2rem;
	}

	.post-card {
		border: 1px solid #e0e0e0;
		border-radius: 8px;
		overflow: hidden;
		transition: transform 0.2s, box-shadow 0.2s;
		background: white;
	}

	.post-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.post-image {
		width: 100%;
		height: 200px;
		object-fit: cover;
	}

	.post-content {
		padding: 1.5rem;
	}

	.post-content h2 {
		margin: 0 0 0.5rem 0;
		font-size: 1.5rem;
	}

	.post-content h2 a {
		color: #333;
		text-decoration: none;
	}

	.post-content h2 a:hover {
		color: #0066cc;
	}

	.post-date {
		color: #666;
		font-size: 0.9rem;
		margin: 0 0 1rem 0;
	}

	.post-summary {
		color: #555;
		line-height: 1.6;
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

	.read-more {
		color: #0066cc;
		text-decoration: none;
		font-weight: 500;
	}

	.read-more:hover {
		text-decoration: underline;
	}

	/* 移動端響應式 */
	@media (max-width: 768px) {
		.tag-posts-container {
			padding: 1.5rem 1rem;
		}

		h1 {
			font-size: 2rem;
			margin-bottom: 1.5rem;
		}

		.posts-grid {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}

		.post-content {
			padding: 1.25rem;
		}

		.post-content h2 {
			font-size: 1.25rem;
		}
	}

	@media (max-width: 480px) {
		.tag-posts-container {
			padding: 1rem 0.75rem;
		}

		h1 {
			font-size: 1.75rem;
			margin-bottom: 1.25rem;
		}

		.posts-grid {
			gap: 1.25rem;
		}

		.post-content {
			padding: 1rem;
		}

		.post-content h2 {
			font-size: 1.1rem;
		}

		.post-summary {
			font-size: 0.9rem;
		}
	}
</style>


