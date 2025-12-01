<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{data.post.title} - VibeBlog</title>
	<meta name="description" content={data.post.description} />
</svelte:head>

<div class="post-container">
	<article class="post">
		<header class="post-header">
			<a href="/blog" class="back-link">← 返回文章列表</a>
			<h1>{data.post.title}</h1>
			<p class="post-meta">
				<span class="date">{new Date(data.post.date).toLocaleDateString('zh-TW')}</span>
			</p>
		</header>

		{#if data.post.image}
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
		margin: 0;
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
</style>

