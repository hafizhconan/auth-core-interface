import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PUBLIC_BASE_DOMAIN } from '$env/static/public';

const clearCookiesAndRedirect = (cookies: any) => {
	const domain = PUBLIC_BASE_DOMAIN.includes('localhost') ? undefined : PUBLIC_BASE_DOMAIN;
	cookies.delete('accessToken', { path: '/', domain });
	cookies.delete('refreshToken', { path: '/', domain });
	cookies.delete('user', { path: '/', domain });

	throw redirect(302, '/login');
};

export const POST: RequestHandler = async ({ cookies }) => {
	return clearCookiesAndRedirect(cookies);
};

export const GET: RequestHandler = async ({ cookies }) => {
	return clearCookiesAndRedirect(cookies);
};

