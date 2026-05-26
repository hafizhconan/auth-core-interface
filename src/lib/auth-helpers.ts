import { authService, type User } from '$lib/api/services/auth-service';
import { showToast } from '$lib/components/shared/toast.svelte';

/**
 * Menangani login sukses dari semua flow (OTP, MFA, dsb):
 * simpan token ke cookie lalu redirect ke '/'.
 */
export async function handleLoginSuccess(data: {
	access_token: string;
	refresh_token: string;
	user: User;
}) {
	authService.setToken(data.access_token, data.refresh_token, data.user);

	showToast({
		type: 'success',
		title: 'Login Berhasil',
		message: 'Selamat datang kembali di Portal Akademik.',
		duration: 2000
	});

	window.location.href = '/';
}
