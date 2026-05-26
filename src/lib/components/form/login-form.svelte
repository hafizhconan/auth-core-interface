<script lang="ts">
	import { Button } from '$lib/components/ui/button/index';
	import * as Form from '$lib/components/ui/form/index';
	import { Input } from '$lib/components/ui/input/index';
	import { Eye, EyeOff } from '@lucide/svelte';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { loginSchema } from '$lib/schema/auth';
	import { showToast } from '$lib/components/shared/toast.svelte';
	import ForgotPasswordModal from './forgot-password-modal.svelte';
	import RequestOtpModal from './request-otp-modal.svelte';
	import MfaModal from './mfa-modal.svelte';

	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let { form: formProps }: { form: SuperValidated<Infer<typeof loginSchema>> } = $props();

	const form = superForm(formProps, {
		validators: zod4Client(loginSchema),
		onResult: ({ result }) => {
			if (result.type === 'redirect') {
				showToast({
					type: 'success',
					title: 'Login Berhasil',
					message: 'Selamat datang kembali di Portal Akademik.',
					duration: 2000 // Tampil selama 2 detik sebelum hilang (atau sampai redirect)
				});
			} else if (result.type === 'success' && (result.data as any)?.mfa_required) {
				// MFA required: open MFA modal with challenge_id from server
				mfaChallengeId = (result.data as any)?.challenge_id ?? null;
				isMfaOpen = true;
			} else if (result.type === 'failure') {
				if (result.status === 401) {
					showToast({
						type: 'danger',
						title: 'Login Gagal',
						message: 'Informasi akun atau kata sandi tidak valid.',
						duration: 5000 // Error butuh waktu lebih lama untuk dibaca (5 detik)
					});
				} else if (result.status >= 500) {
					showToast({
						type: 'danger',
						title: 'Terjadi Kesalahan',
						message: 'Gagal menghubungi server, silakan coba lagi.',
						duration: 5000
					});
				}
			} else if (result.type === 'error') {
				showToast({
					type: 'danger',
					title: 'Terjadi Kesalahan',
					message: 'Terjadi kesalahan sistem, silakan coba beberapa saat lagi.',
					duration: 6000
				});
			}
		},
		onSubmit: ({ formData: payload }) => {
			if (browser) {
				let fingerprint = localStorage.getItem('device_fingerprint');
				let deviceName = localStorage.getItem('device_name');
				let platform = localStorage.getItem('platform');

				if (!fingerprint) {
					fingerprint = window.crypto?.randomUUID?.() ?? Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
					localStorage.setItem('device_fingerprint', fingerprint);
				}

				if (!platform || !deviceName) {
					const ua = navigator.userAgent;
					let detectedName = 'Web Browser';
					if (ua.includes('Chrome')) detectedName = 'Chrome';
					else if (ua.includes('Firefox')) detectedName = 'Firefox';
					else if (ua.includes('Safari') && !ua.includes('Chrome')) detectedName = 'Safari';
					else if (ua.includes('Edge')) detectedName = 'Edge';

					platform = 'web';
					deviceName = `${detectedName} on ${navigator.platform}`;
					localStorage.setItem('platform', platform);
					localStorage.setItem('device_name', deviceName);
				}

				payload.set('device_fingerprint', fingerprint);
				payload.set('platform', platform);
				payload.set('device_name', deviceName);
			}
		}
	});

	const { form: formData, enhance } = form;

	onMount(() => {
		if (browser) {
			const fingerprint = localStorage.getItem('device_fingerprint');
			if (fingerprint) {
				$formData.device_fingerprint = fingerprint;
			}
		}
	});

	let viewPassword = $state(false);
	let isForgotPasswordModalOpen = $state(false);
	let isOtpModalOpen = $state(false);
	let isMfaOpen = $state(false);
	let mfaChallengeId = $state<number | null>(null);

	function handleOpenModalOTP() {
		isOtpModalOpen = true;
	}
</script>

<ForgotPasswordModal bind:open={isForgotPasswordModalOpen} />
<RequestOtpModal bind:open={isOtpModalOpen} />
<MfaModal bind:open={isMfaOpen} challengeId={mfaChallengeId} />

<div class="w-full max-w-[460px]">
	<div class="mb-8">
		<h1 class="text-2xl font-bold leading-tight tracking-tight text-[#333333]">
			Selamat Datang di Portal Yayasan<br />
			Pesantren Islam Al Azhar
		</h1>
		<p class="mt-3 text-[15px] leading-relaxed text-zinc-500">
			Masukkan informasi akun dan kata sandi anda untuk mengakses fitur sistem akademik.
		</p>
	</div>

	<form method="POST" use:enhance class="space-y-5">
		<input type="hidden" name="device_fingerprint" />
		<input type="hidden" name="platform" />
		<input type="hidden" name="device_name" />
		<Form.Field {form} name="username">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label class="text-[13px] font-bold text-[#333333]">Informasi Akun</Form.Label>
					<Input
						{...props}
						bind:value={$formData.username}
						placeholder="Masukkan NIS, NIP, atau nomor HP."
						class="h-11 rounded-lg border-zinc-200 bg-white text-[#333333] placeholder:text-zinc-400 shadow-sm"
					/>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<div class="space-y-1">
			<div class="flex items-center justify-between pb-1">
				<label for="password" class="text-[13px] font-bold text-[#333333]">Kata Sandi</label>
				<button 
					type="button" 
					tabindex="-1"
					class="text-[13px] font-medium text-zinc-400 transition-colors hover:text-zinc-600"
					onclick={() => isForgotPasswordModalOpen = true}
				>
					Lupa Kata Sandi?
				</button>
			</div>
			<Form.Field {form} name="password" class="space-y-0 text-[#333333]">
				<Form.Control>
					{#snippet children({ props })}
						<div class="relative">
							<Input
								{...props}
								id="password"
								bind:value={$formData.password}
								type={viewPassword ? 'text' : 'password'}
								placeholder="Masukkan kata sandi akun Anda"
								class="h-11 rounded-lg border-zinc-200 bg-white pr-10 placeholder:text-zinc-400 shadow-sm"
							/>
							<button
								type="button"
								tabindex="-1"
								class="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 focus:outline-none"
								onclick={() => (viewPassword = !viewPassword)}
							>
								{#if viewPassword}
									<EyeOff class="h-[18px] w-[18px]" strokeWidth="2" />
								{:else}
									<Eye class="h-[18px] w-[18px]" strokeWidth="2" />
								{/if}
							</button>
						</div>
					{/snippet}
				</Form.Control>
				<div class="pt-2"><Form.FieldErrors /></div>
			</Form.Field>
		</div>

		<div class="pt-2">
			<Button type="submit" class="h-11 w-full rounded-lg bg-[#9c917f] text-[15px] font-semibold text-white shadow-sm hover:bg-[#867c6c]">
				Masuk Sekarang
			</Button>
		</div>

		<div class="relative py-4">
			<div class="absolute inset-0 flex items-center">
				<span class="w-full border-t border-zinc-200"></span>
			</div>
			<div class="relative flex justify-center text-xs">
				<span class="bg-[#FAFAFA] px-4 text-zinc-400">Atau</span>
			</div>
		</div>

		<div class="text-center">
			<!-- eslint-disable-next-line -->
			<Button type="button" onclick={handleOpenModalOTP} class="h-11 w-full rounded-lg bg-[#9c917f] text-[15px] font-semibold text-white shadow-sm hover:bg-[#867c6c]">
				Masuk Dengan OTP
			</Button>
		</div>
	</form>
</div>
