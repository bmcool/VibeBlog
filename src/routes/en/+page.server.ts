import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

// 處理 /en/ 重定向到 /en
export const prerender = true;

export const load: PageServerLoad = async () => {
	throw redirect(301, '/en');
};
