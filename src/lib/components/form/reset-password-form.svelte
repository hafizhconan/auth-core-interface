<script lang="ts">
	import { Button } from '$lib/components/ui/button/index';
	import { Input } from '$lib/components/ui/input/index';
	import { Eye, EyeOff, CircleCheck, CircleX } from '@lucide/svelte';
	import { authService } from '$lib/api/services/auth-service';
	import { showToast } from '$lib/components/shared/toast.svelte';
	import { parseApiError, isInvalidError, isExpiredError } from '$lib/utils';

	let { token = '' }: { token?: string } = $props();

	let password = $state('');
	let confirmPassword = $state('');
	let showPassword = $state(false);
	let showConfirmPassword = $state(false);
	let isLoading = $state(false);

	let validations = $derived({
		minLength: password.length >= 8,
		hasAlphaNumeric: /[a-zA-Z]/.test(password) && /[0-9]/.test(password),
		hasUpperCase: /[A-Z]/.test(password),
		match: confirmPassword.length > 0 && password === confirmPassword
	});

	let isFormValid = $derived(Object.values(validations).every((v) => v));

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		if (!token) {
			showToast({ type: 'danger', title: 'Token Tidak Valid', message: 'Token reset tidak valid atau sudah kedaluwarsa.', duration: 5000 });
			return;
		}

		if (!isFormValid) return;

		isLoading = true;

		try {
			const response = await authService.resetPassword({ token, new_password: password });

			showToast({
				type: 'success',
				title: 'Berhasil',
				message: response.message ?? 'Kata sandi berhasil diperbarui.',
				duration: 4000
			});

			window.location.href = '/login';
		} catch (err) {
			const { message } = parseApiError(err);
			console.error('resetPassword error:', err);

			if (isInvalidError(err) || isExpiredError(err)) {
				showToast({ type: 'danger', title: 'Token Tidak Valid', message: 'Token reset tidak valid atau sudah kedaluwarsa. Silakan minta tautan baru.', duration: 5000 });
			} else {
				showToast({ type: 'danger', title: 'Terjadi Kesalahan', message: message || 'Terjadi kesalahan. Silakan coba beberapa saat lagi.', duration: 5000 });
			}
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="relative flex w-full flex-col bg-white lg:w-[50%]">
	<div class="flex flex-1 items-center justify-center p-6 sm:p-12">
		<div class="w-full max-w-[460px]">
			<div class="mb-10">
				<h1 class="text-[32px] font-bold leading-tight tracking-tight text-[#333333]">
					Buat Kata Sandi Baru
				</h1>
				<p class="mt-3 text-[15px] leading-relaxed text-zinc-500">
					Masukkan kata sandi baru untuk melanjutkan akses ke portal<br />
					International Visea School.
				</p>
			</div>

			<form onsubmit={handleSubmit} class="space-y-6">
				<!-- Password Field -->
				<div class="space-y-4">
					<div class="space-y-2">
						<label for="password" class="text-[13px] font-bold text-[#333333]">
							Kata Sandi Baru
						</label>
						<div class="relative">
							<Input
								id="password"
								type={showPassword ? 'text' : 'password'}
								bind:value={password}
								placeholder="Masukkan kata sandi baru"
								disabled={isLoading}
								class="h-12 rounded-xl border-zinc-200 bg-white pr-10 placeholder:text-zinc-400 shadow-sm"
							/>
							<button
								type="button"
								tabindex="-1"
								class="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 focus:outline-none"
								onclick={() => (showPassword = !showPassword)}
							>
								{#if showPassword}
									<EyeOff class="h-5 w-5" strokeWidth="1.5" />
								{:else}
									<Eye class="h-5 w-5" strokeWidth="1.5" />
								{/if}
							</button>
						</div>
					</div>

					<!-- Validations for Password -->
					<div class="space-y-2">
						<div class="flex items-center gap-2 text-[13px] {validations.minLength ? 'text-emerald-600 font-medium' : 'text-zinc-400'}">
							<CircleCheck class="h-4 w-4" strokeWidth={validations.minLength ? 2.5 : 1.5} />
							<span>Minimal 8 karakter</span>
						</div>
						<div class="flex items-center gap-2 text-[13px] {validations.hasAlphaNumeric ? 'text-emerald-600 font-medium' : 'text-zinc-400'}">
							<CircleCheck class="h-4 w-4" strokeWidth={validations.hasAlphaNumeric ? 2.5 : 1.5} />
							<span>Kombinasi huruf dan angka</span>
						</div>
						<div class="flex items-center gap-2 text-[13px] {validations.hasUpperCase ? 'text-emerald-600 font-medium' : 'text-zinc-400'}">
							<CircleCheck class="h-4 w-4" strokeWidth={validations.hasUpperCase ? 2.5 : 1.5} />
							<span>Terdapat 1 huruf besar</span>
						</div>
					</div>
				</div>

				<!-- Confirm Password Field -->
				<div class="space-y-4">
					<div class="space-y-2">
						<label for="confirm-password" class="text-[13px] font-bold text-[#333333]">
							Konfirmasi Kata Sandi
						</label>
						<div class="relative">
							<Input
								id="confirm-password"
								type={showConfirmPassword ? 'text' : 'password'}
								bind:value={confirmPassword}
								placeholder="Ulangi kata sandi baru"
								disabled={isLoading}
								class="h-12 rounded-xl border-zinc-200 bg-white pr-10 placeholder:text-zinc-400 shadow-sm"
							/>
							<button
								type="button"
								tabindex="-1"
								class="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 focus:outline-none"
								onclick={() => (showConfirmPassword = !showConfirmPassword)}
							>
								{#if showConfirmPassword}
									<EyeOff class="h-5 w-5" strokeWidth="1.5" />
								{:else}
									<Eye class="h-5 w-5" strokeWidth="1.5" />
								{/if}
							</button>
						</div>
					</div>

					<div
						class="flex items-center gap-2 text-[13px]
						{confirmPassword.length > 0
							? password === confirmPassword
								? 'text-emerald-600 font-medium'
								: 'text-red-500 font-medium'
							: 'text-zinc-400'}"
					>
						{#if confirmPassword.length > 0 && password !== confirmPassword}
							<CircleX class="h-4 w-4" strokeWidth={2.5} />
						{:else}
							<CircleCheck class="h-4 w-4" strokeWidth={confirmPassword.length > 0 ? 2.5 : 1.5} />
						{/if}
						<span>Sesuai Terhadap Kata Sandi Baru</span>
					</div>
				</div>


				<div class="pt-4">
					<Button
						type="submit"
						class="h-14 w-full rounded-xl bg-[#9c917f] text-[15px] font-semibold text-white shadow-sm hover:bg-[#867c6c] transition-all disabled:opacity-60"
						disabled={!isFormValid || isLoading}
					>
						{#if isLoading}
							<span class="flex items-center gap-2">
								<span class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
								Memproses...
							</span>
						{:else}
							Ganti Kata Sandi Sekarang
						{/if}
					</Button>
				</div>
			</form>
		</div>
	</div>

	<!-- Footer text -->
	<div class="pb-10 text-center text-[13px] font-medium text-zinc-400">
		© 2026 International Visea School . All rights reserved.
	</div>
</div>
