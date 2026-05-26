import type { Handle } from '@sveltejs/kit';

export const handleAuth: Handle = async ({ event, resolve }) => {

	const accessToken = event.cookies.get('accessToken');
	const userCookie = event.cookies.get('user');

	if (!accessToken || !userCookie) {
		event.locals.user = null;
		return resolve(event);
	}

	try {
		const user = JSON.parse(userCookie);
		event.locals.user = user;
	} catch (error) {
		console.log('auth error or invalid session: ', error instanceof Error ? error.message : String(error));
		event.locals.user = null;
		event.cookies.delete('accessToken', { path: '/' });
		event.cookies.delete('refreshToken', { path: '/' });
		event.cookies.delete('user', { path: '/' });
	}

	return resolve(event);
};
