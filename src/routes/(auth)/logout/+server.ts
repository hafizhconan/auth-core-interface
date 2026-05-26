import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies }) => {
    // Clear all auth-related cookies
    cookies.delete('accessToken', { path: '/' });
    cookies.delete('refreshToken', { path: '/' });
    cookies.delete('user', { path: '/' });

    throw redirect(303, '/login');
};

export const GET: RequestHandler = async () => {
    throw redirect(303, '/');
};
