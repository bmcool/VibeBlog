<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { parseLanguage } from '$lib/utils/language';

	let { data }: { data: PageData } = $props();
	
	// 计算语言参数
	const langParam = $derived(data.lang === 'en' ? '?lang=en' : '');
</script>

<svelte:head>
	<title>{data.lang === 'en' ? 'All Tags - VibeBlog' : '所有標籤 - VibeBlog'}</title>
</svelte:head>

<div class="tags-container">
	<h1>{data.lang === 'en' ? 'All Tags' : '所有標籤'}</h1>

	{#if data.tags.length === 0}
		<p>{data.lang === 'en' ? 'No tags yet.' : '目前還沒有標籤。'}</p>
	{:else}
		<div class="tags-list">
			{#each data.tags as tag}
				<a href={langParam ? `/tags/${encodeURIComponent(tag)}${langParam}` : `/tags/${encodeURIComponent(tag)}`} class="tag-link">
					{tag}
				</a>
			{/each}
		</div>
	{/if}
</div>

<style>
	.tags-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}

	h1 {
		font-size: 2.5rem;
		margin-bottom: 2rem;
		color: #333;
	}

	.tags-list {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.tag-link {
		display: inline-block;
		padding: 0.5rem 1.5rem;
		background: #f0f0f0;
		border-radius: 20px;
		text-decoration: none;
		color: #333;
		font-weight: 500;
		transition: all 0.2s;
	}

	.tag-link:hover {
		background: #0066cc;
		color: white;
		transform: translateY(-2px);
		box-shadow: 0 2px 8px rgba(0, 102, 204, 0.3);
	}
</style>


