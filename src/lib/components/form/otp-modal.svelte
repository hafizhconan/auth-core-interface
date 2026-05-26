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
		email = '****@****.com',
		challengeId = null as number | null,
		expiresIn = 600
	} = $props();

	let otp = $state(['', '', '', '', '', '']);
	let timer = $state(expiresIn);
	let otpError = $state('');
	let isLoading = $state(false);
	let timerInterval: ReturnType<typeof setInterval> | null = null;

	// Reset & start countdown when modal opens
	$effect(() => {
		if (open) {
			timer = expiresIn;
			otpError = '';
			otp = ['', '', '', '', '', ''];
			startTimer();
		} else {
			stopTimer();
		}
		return () => stopTimer();
	});

	function startTimer() {
		stopTimer();
		timerInterval = setInterval(() => {
			if (timer > 0) {
				timer -= 1;
			} else {
				stopTimer();
			}
		}, 1000);
	}

	function stopTimer() {
		if (timerInterval !== null) {
			clearInterval(timerInterval);
			timerInterval = null;
		}
	}

	function handleCancel() {
		open = false;
	}

	async function handleSubmit() {
		const otpCode = otp.join('');

		if (otpCode.length < 6) {
			otpError = 'Masukkan 6 digit kode OTP.';
			return;
		}

		if (timer <= 0) {
			otpError = 'Kode OTP sudah kedaluwarsa. Silakan minta kode baru.';
			return;
		}

		otpError = '';
		isLoading = true;

		try {
			const response = await authService.verifyOTP({
				challenge_id: challengeId,
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
				otpError = 'Kode OTP sudah kedaluwarsa. Silakan minta kode baru.';
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

	function formatTimer(seconds: number) {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	}

	async function handleResend() {
		if (!email || email === '****@****.com') return;
		try {
			await authService.requestOTP({ email });
			timer = expiresIn;
			otp = ['', '', '', '', '', ''];
			otpError = '';
			startTimer();
			showToast({
				type: 'success',
				title: 'OTP Dikirim',
				message: 'Kode OTP baru telah dikirim ke email Anda.',
				duration: 3000
			});
		} catch {
			showToast({
				type: 'danger',
				title: 'Gagal Mengirim OTP',
				message: 'Silakan coba beberapa saat lagi.',
				duration: 4000
			});
		}
	}
</script>

<BaseModal bind:open title="Verifikasi OTP" contentClass="w-full max-w-[420px]">
	{#snippet content()}
		<div class="flex flex-col gap-5">
			<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F4F4F5]">
				<ShieldCheck class="h-5 w-5 text-zinc-600" strokeWidth={1.5} />
			</div>

			<p class="text-[15px] font-semibold leading-relaxed text-[#333333]">
				Kode OTP telah dikirim ke<br />
				<span class="text-[#9c917f]">{email}</span>.
			</p>

			<div class="space-y-3">
				<div class="text-[13px] font-bold text-[#333333]">Masukkan Kode OTP</div>

				<OtpInput bind:value={otp} hasError={!!otpError} disabled={isLoading} idPrefix="otp" />

				{#if otpError}
					<p class="text-[12px] font-medium text-red-500">{otpError}</p>
				{/if}

				<div class="flex items-center justify-between">
					<button
						type="button"
						class="text-[13px] font-medium text-zinc-500 transition-colors hover:text-zinc-800 hover:underline disabled:cursor-not-allowed disabled:opacity-40"
						onclick={handleResend}
						disabled={timer > 0 || isLoading}
					>
						Kirim ulang
					</button>
					<span class="text-[13px] font-bold {timer <= 30 ? 'text-red-600' : 'text-zinc-500'}">
						{formatTimer(timer)}
					</span>
				</div>
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
