import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// 處理 /en/ 重定向到 /en
	if (event.url.pathname === '/en/') {
		throw redirect(301, '/en');
	}

	return resolve(event);
};
