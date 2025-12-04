import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// 使用自定义域名，不需要 base path
		adapter: adapter({
			// 输出目录：build
			// 这是 SvelteKit 的标准静态输出目录
			pages: 'build',
			assets: 'build',
			fallback: undefined,
			precompress: false,
			strict: true
		}),
		prerender: {
			handleUnseenRoutes: 'warn' // 对于未预渲染的路由只警告，不中断构建
		}
	}
};

export default config;
