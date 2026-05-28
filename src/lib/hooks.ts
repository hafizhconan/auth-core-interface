import type { Handle } from '@sveltejs/kit';
import { authService } from '$lib/api/services/auth-service';
import { PUBLIC_BASE_DOMAIN } from '$env/static/public';

export const handleAuth: Handle = async ({ event, resolve }) => {
	let accessToken = event.cookies.get('accessToken');
	const refreshToken = event.cookies.get('refreshToken');
	const userCookie = event.cookies.get('user');
	const domain = PUBLIC_BASE_DOMAIN.includes('localhost') ? undefined : PUBLIC_BASE_DOMAIN;

	// Case 1: Active access token and user cookie exist
	if (accessToken && userCookie) {
		try {
			const user = JSON.parse(userCookie);
			// Validate that the access token is still valid with the backend
			await authService.getUserProfile(accessToken);
			event.locals.user = user;
			return resolve(event);
		} catch (error) {
			console.log('auth error, expired access token, or invalid user cookie — falling back to refresh:', error instanceof Error ? error.message : String(error));
			accessToken = undefined; // Force falling through to Case 2
		}
	}

	// Case 2: Access token is missing/expired, but refresh token is present -> Auto Refresh!
	if (!accessToken && refreshToken) {
		try {
			console.log('[hooks] Access token expired/missing. Attempting auto-refresh...');
			const refreshData = await authService.refreshToken(refreshToken);

			// 1. Set the new access token
			event.cookies.set('accessToken', refreshData.access_token, {
				path: '/',
				domain,
				httpOnly: false,
				sameSite: 'strict',
				secure: import.meta.env.PROD,
				maxAge: 60 * 60 * 24 * 30
			});

			// 2. Set the new refresh token (for family rotation)
			event.cookies.set('refreshToken', refreshData.refresh_token, {
				path: '/',
				domain,
				httpOnly: true,
				sameSite: 'strict',
				secure: import.meta.env.PROD,
				maxAge: 60 * 60 * 24 * 30
			});

			// 3. Fetch user profile using the new access token to update the user cookie
			const userProfile = await authService.getUserProfile(refreshData.access_token);
			const user = userProfile.data;

			event.cookies.set('user', JSON.stringify(user), {
				path: '/',
				domain,
				httpOnly: false,
				sameSite: 'strict',
				secure: import.meta.env.PROD,
				maxAge: 60 * 60 * 24 * 30
			});

			event.locals.user = user;
			console.log('[hooks] Auto-refresh successful. User: ', user.email);
			return resolve(event);
		} catch (error) {
			console.error('[hooks] Auto-refresh failed, clearing session:', error instanceof Error ? error.message : String(error));
		}
	}

	// Case 3: No valid session or refresh failed -> clear all cookies
	event.locals.user = null;
	event.cookies.delete('accessToken', { path: '/', domain });
	event.cookies.delete('refreshToken', { path: '/', domain });
	event.cookies.delete('user', { path: '/', domain });

	return resolve(event);
};

