<script lang="ts">
	import BaseModal from '$lib/components/shared/base-modal.svelte';
	import { Button } from '$lib/components/ui/button/index';
	import ShieldCheck from '@lucide/svelte/icons/shield-check';
	import { authService } from '$lib/api/services/auth-service';
	import { showToast } from '$lib/components/shared/toast.svelte';
	import { getDeviceInfo, isInvalidError, isExpiredError, parseApiError } from '$lib/utils';
	import { handleLoginSuccess } from '$lib/auth-helpers';
	import OtpInput from '$lib/components/ui/otp-input/otp-input.svelte';

	let {
		open = $bindable(false),
		challengeId = null as number | null
	} = $props();

	let otp = $state(['', '', '', '', '', '']);
	let otpError = $state('');
	let isLoading = $state(false);

	// Reset state when modal opens
	$effect(() => {
		if (open) {
			otp = ['', '', '', '', '', ''];
			otpError = '';
			isLoading = false;
		}
	});

	function handleCancel() {
		open = false;
	}

	async function handleSubmit() {
		const otpCode = otp.join('');

		if (otpCode.length < 6) {
			otpError = 'Masukkan 6 digit kode OTP.';
			return;
		}

		otpError = '';
		isLoading = true;

		try {
			// challenge_id: gunakan dari props, fallback ke random Crypto
			const resolvedChallengeId =
				challengeId ?? parseInt(crypto.getRandomValues(new Uint32Array(1))[0].toString().slice(0, 6));

			const response = await authService.verifyMFA({
				challenge_id: resolvedChallengeId,
				otp_code: otpCode,
				...getDeviceInfo()
			});

			if (!response.data?.access_token) {
				otpError = 'Verifikasi gagal. Silakan coba lagi.';
				return;
			}

			open = false;
			await handleLoginSuccess(response.data);
		} catch (err) {
			if (isInvalidError(err)) {
				otpError = 'Kode OTP tidak valid. Periksa kembali kode yang Anda masukkan.';
			} else if (isExpiredError(err)) {
				otpError = 'Kode OTP sudah kedaluwarsa. Silakan login kembali.';
			} else {
				const { message } = parseApiError(err);
				showToast({
					type: 'danger',
					title: 'Login Gagal',
					message: message || 'Terjadi kesalahan. Silakan coba beberapa saat lagi.',
					duration: 5000
				});
			}
		} finally {
			isLoading = false;
		}
	}
</script>

<BaseModal bind:open title="Verifikasi Dua Langkah" contentClass="w-full max-w-[420px]">
	{#snippet content()}
		<div class="flex flex-col gap-5">
			<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F4F4F5]">
				<ShieldCheck class="h-5 w-5 text-zinc-600" strokeWidth={1.5} />
			</div>

			<p class="text-[15px] font-semibold leading-relaxed text-[#333333]">
				Akun Anda dilindungi dengan verifikasi dua langkah.<br />
				Masukkan kode OTP yang dikirim ke perangkat Anda.
			</p>

			<div class="space-y-3">
				<div class="text-[13px] font-bold text-[#333333]">Kode OTP</div>

				<OtpInput bind:value={otp} hasError={!!otpError} disabled={isLoading} idPrefix="mfa" />

				{#if otpError}
					<p class="text-[12px] font-medium text-red-500">{otpError}</p>
				{/if}
			</div>
		</div>
	{/snippet}

	{#snippet footer()}
		<div class="grid w-full grid-cols-2 gap-3">
			<Button
				variant="ghost"
				class="h-11 w-full rounded-lg text-[15px] font-semibold text-zinc-500 hover:bg-transparent hover:text-zinc-700"
				onclick={handleCancel}
				disabled={isLoading}
			>
				Batal
			</Button>
			<Button
				class="h-11 w-full rounded-lg bg-[#9c917f] text-[15px] font-semibold text-white shadow-sm hover:bg-[#867c6c] disabled:opacity-60"
				onclick={handleSubmit}
				disabled={isLoading || otp.join('').length < 6}
			>
				{#if isLoading}
					<span class="flex items-center gap-2">
						<span class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
						></span>
						Memverifikasi...
					</span>
				{:else}
					Verifikasi
				{/if}
			</Button>
		</div>
	{/snippet}
</BaseModal>
