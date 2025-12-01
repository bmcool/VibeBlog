<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<nav class="main-nav">
	<div class="nav-container">
		<a href="/" class="logo">VibeBlog</a>
		<div class="nav-links">
			<a href="/">首頁</a>
			<a href="/blog">文章</a>
		</div>
	</div>
</nav>

<main>
	{@render children()}
</main>

<style>
	.main-nav {
		background: #fff;
		border-bottom: 1px solid #e0e0e0;
		padding: 1rem 0;
		margin-bottom: 2rem;
	}

	.nav-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 2rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.logo {
		font-size: 1.5rem;
		font-weight: bold;
		color: #333;
		text-decoration: none;
	}

	.nav-links {
		display: flex;
		gap: 2rem;
	}

	.nav-links a {
		color: #666;
		text-decoration: none;
		font-weight: 500;
		transition: color 0.2s;
	}

	.nav-links a:hover {
		color: #0066cc;
	}

	main {
		min-height: calc(100vh - 200px);
	}
</style>
