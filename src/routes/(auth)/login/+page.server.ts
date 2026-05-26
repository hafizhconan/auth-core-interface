import { superValidate } from 'sveltekit-superforms';
import type { PageServerLoad, Actions } from './$types';
import { loginSchema } from '$lib/schema/auth';
import { zod4 } from 'sveltekit-superforms/adapters';
import { redirect, fail, isRedirect } from '@sveltejs/kit';
import { authService } from '$lib/api/services/auth-service';
import { PUBLIC_BASE_DOMAIN } from '$env/static/public';

export const load = (async ({ cookies }) => {
	const accessToken = cookies.get('accessToken');

	if (accessToken) {
		throw redirect(302, '/');
	}

	return {
		form: await superValidate(zod4(loginSchema))
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const form = await superValidate(request, zod4(loginSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			const loginData = await authService.login({
				email: form.data.username,
				password: form.data.password,
				device_fingerprint: form.data.device_fingerprint,
				platform: form.data.platform,
				device_name: form.data.device_name
			});
			console.log(loginData.data)
			// MFA required: return challenge data to client — do NOT save tokens yet
			if (loginData.data?.mfa_required) {
				return {
					form,
					mfa_required: true,
					challenge_id: loginData.data.challenge_id ?? null
				};
			}

			if (!loginData.data?.access_token || !loginData.data?.refresh_token || !loginData.data?.user) {
				return fail(401, { form });
			}
			// Set Access Token in Cookie (accessible by client-side axios via js-cookie)
			cookies.set('accessToken', loginData.data.access_token, {
				path: '/',
				domain: PUBLIC_BASE_DOMAIN.includes('localhost') ? undefined : PUBLIC_BASE_DOMAIN,
				httpOnly: false,
				sameSite: 'strict',
				secure: import.meta.env.PROD,
				maxAge: 60 * 60 * 24 * 30
			});

			// Set Refresh Token in Cookie
			cookies.set('refreshToken', loginData.data.refresh_token, {
				path: '/',
				domain: PUBLIC_BASE_DOMAIN.includes('localhost') ? undefined : PUBLIC_BASE_DOMAIN,
				httpOnly: true, // Refresh token is usually only needed by the server
				sameSite: 'strict',
				secure: import.meta.env.PROD,
				maxAge: 60 * 60 * 24 * 30
			});

			// Set User Info in Cookie
			cookies.set('user', JSON.stringify(loginData.data.user), {
				path: '/',
				domain: PUBLIC_BASE_DOMAIN.includes('localhost') ? undefined : PUBLIC_BASE_DOMAIN,
				httpOnly: false,
				sameSite: 'strict',
				secure: import.meta.env.PROD,
				maxAge: 60 * 60 * 24 * 30
			});

			throw redirect(302, '/');
		} catch (err) {
			if (isRedirect(err)) throw err;
			console.error('Server side login error:', err);
			return fail(500, { form });
		}
	}
};
