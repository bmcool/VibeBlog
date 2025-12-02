import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	server: {
		port: 4660,
		host: '0.0.0.0'
	},
	plugins: [sveltekit()],
	logLevel: 'info'
});
