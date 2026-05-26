<script lang="ts">
	import BaseModal from '$lib/components/shared/base-modal.svelte';
	import { Input } from '$lib/components/ui/input/index';
	import { Button } from '$lib/components/ui/button/index';
	import Mail from '@lucide/svelte/icons/mail';
	import { authService } from '$lib/api/services/auth-service';
	import { isNotFoundError, parseApiError } from '$lib/utils';
	import OtpModal from './otp-modal.svelte';

	let { open = $bindable(false) } = $props();

	let email = $state('');
	let emailError = $state('');
	let isLoading = $state(false);

	// OTP modal state
	let isOtpOpen = $state(false);
	let otpEmail = $state('');
	let otpChallengeId = $state<number | null>(null);
	let otpExpiresIn = $state<number>(600);

	function handleCancel() {
		open = false;
		resetForm();
	}

	function resetForm() {
		email = '';
		emailError = '';
		isLoading = false;
	}

	function validateEmail(value: string): boolean {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
	}

	async function handleSubmit() {
		emailError = '';

		if (!email.trim()) {
			emailError = 'Email tidak boleh kosong.';
			return;
		}

		if (!validateEmail(email.trim())) {
			emailError = 'Format email tidak valid.';
			return;
		}

		isLoading = true;

		try {
			const response = await authService.requestOTP({ email: email.trim() });

			otpEmail = email.trim();
			otpChallengeId = response.data?.challenge_id ?? null;
			otpExpiresIn = response.data?.expires_in ?? 600;
			open = false;
			resetForm();

			setTimeout(() => { isOtpOpen = true; }, 300);
		} catch (err) {
			const { status, message } = parseApiError(err);

			if (isNotFoundError(err)) {
				emailError = 'Email tidak ditemukan. Pastikan email yang Anda masukkan sudah terdaftar.';
			} else if (status === 422) {
				emailError = 'Format email tidak valid.';
			} else {
				emailError = message || 'Terjadi kesalahan. Silakan coba beberapa saat lagi.';
			}
		} finally {
			isLoading = false;
		}
	}

	function handleEmailInput() {
		if (emailError) emailError = '';
	}
</script>

<OtpModal bind:open={isOtpOpen} email={otpEmail} challengeId={otpChallengeId} expiresIn={otpExpiresIn} />

<BaseModal
	bind:open
	title="Masuk dengan OTP"
	contentClass="w-full max-w-[420px]"
	onOpenChange={(val) => { if (!val) resetForm(); }}
>
	{#snippet content()}
		<div class="flex flex-col gap-5">
			<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F4F4F5]">
				<Mail class="h-5 w-5 text-zinc-600" strokeWidth={1.5} />
			</div>

			<p class="text-[15px] font-semibold leading-relaxed text-[#333333]">
				Masukkan alamat email yang terdaftar untuk<br />
				menerima kode OTP.
			</p>

			<div class="space-y-2">
				<label for="otp-email" class="text-[13px] font-bold text-[#333333]">
					Alamat Email
				</label>
				<Input
					id="otp-email"
					type="email"
					bind:value={email}
					oninput={handleEmailInput}
					placeholder="Masukkan alamat email Anda"
					disabled={isLoading}
					class="h-11 rounded-lg border-zinc-200 bg-white text-[#333333] placeholder:text-zinc-400 shadow-sm
						{emailError ? 'border-red-400 focus-visible:ring-red-400' : ''}"
				/>
				{#if emailError}
					<p class="text-[12px] font-medium text-red-500">{emailError}</p>
				{/if}
			</div>
		</div>
	{/snippet}

	{#snippet footer()}
		<div class="grid w-full grid-cols-2 gap-3 pt-2">
			<Button
				variant="ghost"
				class="h-11 w-full rounded-lg text-[15px] font-semibold text-[#9c917f] hover:bg-transparent hover:text-[#867c6c]"
				onclick={handleCancel}
				disabled={isLoading}
			>
				Batal
			</Button>
			<Button
				class="h-11 w-full rounded-lg bg-[#9c917f] text-[15px] font-semibold text-white shadow-sm hover:bg-[#867c6c] disabled:opacity-60"
				onclick={handleSubmit}
				disabled={isLoading}
			>
				{#if isLoading}
					<span class="flex items-center gap-2">
						<span class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
						Mengirim...
					</span>
				{:else}
					Kirim OTP
				{/if}
			</Button>
		</div>
	{/snippet}
</BaseModal>
