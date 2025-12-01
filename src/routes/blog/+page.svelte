<script lang="ts">
	import type { PageData } from './$types';
	import type { BlogPost } from '$lib/types/blog';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>VibeBlog - 所有文章</title>
</svelte:head>

<div class="blog-container">
	<h1>VibeBlog 文章列表</h1>
	
	<div class="posts-grid">
		{#each data.posts as post (post.slug)}
			<article class="post-card">
				{#if post.image}
					<img src={post.image} alt={post.title} class="post-image" />
				{/if}
				<div class="post-content">
					<h2><a href="/blog/{post.slug}">{post.title}</a></h2>
					<p class="post-date">{new Date(post.date).toLocaleDateString('zh-TW')}</p>
					<p class="post-description">{post.description}</p>
					<a href="/blog/{post.slug}" class="read-more">閱讀更多 →</a>
				</div>
			</article>
		{/each}
	</div>
</div>

<style>
	.blog-container {
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

	.post-description {
		color: #555;
		line-height: 1.6;
		margin: 0 0 1rem 0;
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

