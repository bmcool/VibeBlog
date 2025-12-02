<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	
	// 计算语言参数
	const langParam = $derived(data.lang === 'en' ? '?lang=en' : '');
</script>

<svelte:head>
	<title>{data.lang === 'en' ? `Tag: ${data.tag} - VibeBlog` : `標籤：${data.tag} - VibeBlog`}</title>
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
						<h2><a href={langParam ? `/blog/${post.slug}${langParam}` : `/blog/${post.slug}`}>{post.title}</a></h2>
						<p class="post-date">{new Date(post.date).toLocaleDateString(data.lang === 'en' ? 'en-US' : 'zh-TW')}</p>
						{#if post.summary}
							<p class="post-summary">{post.summary}</p>
						{/if}
						<div class="post-tags">
							{#each post.tags as tagItem}
								<a href={langParam ? `/tags/${encodeURIComponent(tagItem)}${langParam}` : `/tags/${encodeURIComponent(tagItem)}`} class="tag-badge">{tagItem}</a>
							{/each}
						</div>
						<a href={langParam ? `/blog/${post.slug}${langParam}` : `/blog/${post.slug}`} class="read-more">{data.lang === 'en' ? 'Read more →' : '閱讀更多 →'}</a>
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
</style>


