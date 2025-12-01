<script lang="ts">
	import { getAllPosts } from '$lib/data/posts';
	
	const latestPost = getAllPosts()[0];
</script>

<div class="home-container">
	<header class="hero">
		<h1>Welcome to VibeBlog</h1>
		<p class="subtitle">基於 SvelteKit 建立的部落格應用程式</p>
	</header>

	{#if latestPost}
		<section class="latest-post">
			<h2>最新文章</h2>
			<article class="post-preview">
				{#if latestPost.image}
					<img src={latestPost.image} alt={latestPost.title} class="preview-image" />
				{/if}
				<div class="preview-content">
					<h3><a href="/blog/{latestPost.slug}">{latestPost.title}</a></h3>
					<p class="post-date">{new Date(latestPost.date).toLocaleDateString('zh-TW')}</p>
					<p class="post-description">{latestPost.description}</p>
					<a href="/blog/{latestPost.slug}" class="read-more">閱讀全文 →</a>
				</div>
			</article>
		</section>
	{/if}

	<nav class="cta">
		<a href="/blog" class="btn">查看所有文章</a>
	</nav>
</div>

<style>
	.home-container {
		max-width: 1000px;
		margin: 0 auto;
		padding: 2rem;
	}

	.hero {
		text-align: center;
		margin-bottom: 3rem;
		padding: 2rem 0;
	}

	.hero h1 {
		font-size: 3rem;
		margin: 0 0 1rem 0;
		color: #333;
	}

	.subtitle {
		font-size: 1.2rem;
		color: #666;
		margin: 0;
	}

	.latest-post {
		margin-bottom: 3rem;
	}

	.latest-post h2 {
		font-size: 2rem;
		margin-bottom: 1.5rem;
		color: #333;
	}

	.post-preview {
		display: flex;
		gap: 2rem;
		border: 1px solid #e0e0e0;
		border-radius: 8px;
		padding: 1.5rem;
		background: white;
		transition: box-shadow 0.2s;
	}

	.post-preview:hover {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.preview-image {
		width: 300px;
		height: 200px;
		object-fit: cover;
		border-radius: 8px;
		flex-shrink: 0;
	}

	.preview-content {
		flex: 1;
	}

	.preview-content h3 {
		margin: 0 0 0.5rem 0;
		font-size: 1.5rem;
	}

	.preview-content h3 a {
		color: #333;
		text-decoration: none;
	}

	.preview-content h3 a:hover {
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

	.cta {
		text-align: center;
	}

	.btn {
		display: inline-block;
		padding: 0.75rem 2rem;
		background: #0066cc;
		color: white;
		text-decoration: none;
		border-radius: 5px;
		font-weight: 500;
		transition: background 0.2s;
	}

	.btn:hover {
		background: #0052a3;
	}

	@media (max-width: 768px) {
		.post-preview {
			flex-direction: column;
		}

		.preview-image {
			width: 100%;
		}
	}
</style>
