<script lang="ts">
	import BaseModal from "$lib/components/shared/base-modal.svelte";
	import { Input } from "$lib/components/ui/input/index";
	import { Button } from "$lib/components/ui/button/index";
	import UserIcon from "@lucide/svelte/icons/user";
	import { authService, type User } from "$lib/api/services/auth-service";
	import { showToast } from "$lib/components/shared/toast.svelte";
	import { parseApiError } from "$lib/utils";
	import Cookies from 'js-cookie';

	let { open = $bindable(false), user }: { open: boolean; user: User } = $props();

	let displayName = $state(user?.display_name || "");
	let email = $state(user?.email || "");
	let password = $state("");
	
	let displayNameError = $state("");
	let emailError = $state("");
	let passwordError = $state("");
	let isLoading = $state(false);

	// Synchronize when user prop or modal changes
	$effect(() => {
		if (open && user) {
			displayName = user.display_name;
			email = user.email;
			password = "";
			displayNameError = "";
			emailError = "";
			passwordError = "";
		}
	});

	function handleCancel() {
		open = false;
	}

	async function handleSave() {
		displayNameError = "";
		emailError = "";
		passwordError = "";

		let hasError = false;

		if (!displayName.trim()) {
			displayNameError = "Nama lengkap tidak boleh kosong.";
			hasError = true;
		} else if (displayName.trim().length < 2) {
			displayNameError = "Nama lengkap minimal 2 karakter.";
			hasError = true;
		}

		if (!email.trim()) {
			emailError = "Email tidak boleh kosong.";
			hasError = true;
		} else if (!email.includes("@")) {
			emailError = "Format email tidak valid.";
			hasError = true;
		}

		if (password && password.length < 8) {
			passwordError = "Kata sandi minimal harus 8 karakter.";
			hasError = true;
		}

		if (hasError) return;

		isLoading = true;

		try {
			const payload: { display_name: string; email: string; password?: string } = {
				display_name: displayName.trim(),
				email: email.trim()
			};
			if (password) {
				payload.password = password;
			}

			await authService.updateUserProfile(payload);

			showToast({
				type: 'success',
				title: 'Profil Diperbarui',
				message: 'Informasi profil Anda berhasil disimpan.',
				duration: 3000
			});

			// Update Cookie so change is persisted across reloads
			const updatedUser = { ...user, display_name: displayName.trim(), email: email.trim() };
			authService.setToken(
				Cookies.get('accessToken') || "",
				Cookies.get('refreshToken') || "",
				updatedUser
			);

			// Close the modal and let the UI reload
			open = false;
			window.location.reload();
		} catch (err) {
			const { message } = parseApiError(err);
			console.error("updateProfile error:", err);
			showToast({
				type: 'danger',
				title: 'Gagal Memperbarui',
				message: message || 'Terjadi kesalahan saat menyimpan profil.',
				duration: 5000
			});
		} finally {
			isLoading = false;
		}
	}
</script>

<BaseModal
	bind:open
	title="Pengaturan Profil"
	contentClass="w-full max-w-[420px]"
>
	{#snippet content()}
		<div class="flex flex-col gap-5">
			<div class="space-y-4">
				<!-- Display Name -->
				<div class="space-y-1.5">
					<label for="display-name" class="text-[13px] font-bold text-[#333333]">
						Nama Lengkap
					</label>
					<Input
						id="display-name"
						type="text"
						bind:value={displayName}
						disabled={isLoading}
						class="h-11 rounded-lg border-zinc-200 bg-white text-[#333333] placeholder:text-zinc-400 shadow-sm
							{displayNameError ? 'border-red-400 focus-visible:ring-red-400' : ''}"
					/>
					{#if displayNameError}
						<p class="text-[12px] font-medium text-red-500">{displayNameError}</p>
					{/if}
				</div>

				<!-- Email -->
				<div class="space-y-1.5">
					<label for="profile-email" class="text-[13px] font-bold text-[#333333]">
						Email
					</label>
					<Input
						id="profile-email"
						type="email"
						bind:value={email}
						disabled={isLoading}
						class="h-11 rounded-lg border-zinc-200 bg-white text-[#333333] placeholder:text-zinc-400 shadow-sm
							{emailError ? 'border-red-400 focus-visible:ring-red-400' : ''}"
					/>
					{#if emailError}
						<p class="text-[12px] font-medium text-red-500">{emailError}</p>
					{/if}
				</div>

				<!-- Password (Optional) -->
				<div class="space-y-1.5">
					<label for="profile-password" class="text-[13px] font-bold text-[#333333]">
						Kata Sandi Baru <span class="font-normal text-zinc-400">(Opsional)</span>
					</label>
					<Input
						id="profile-password"
						type="password"
						bind:value={password}
						placeholder="Masukkan untuk mengubah kata sandi"
						disabled={isLoading}
						class="h-11 rounded-lg border-zinc-200 bg-white text-[#333333] placeholder:text-zinc-400 shadow-sm
							{passwordError ? 'border-red-400 focus-visible:ring-red-400' : ''}"
					/>
					{#if passwordError}
						<p class="text-[12px] font-medium text-red-500">{passwordError}</p>
					{:else}
						<p class="text-[11px] text-zinc-400 leading-normal">
							Biarkan kosong jika Anda tidak ingin mengganti kata sandi.
						</p>
					{/if}
				</div>
			</div>
		</div>
	{/snippet}

	{#snippet footer()}
		<div class="grid w-full grid-cols-2 gap-3 pt-2">
			<Button
				variant="ghost"
				class="h-11 w-full rounded-lg text-[15px] font-semibold text-[#9c917f] hover:bg-transparent hover:text-[#867c6c] cursor-pointer"
				onclick={handleCancel}
				disabled={isLoading}
			>
				Batal
			</Button>
			<Button
				class="h-11 w-full rounded-lg bg-[#9c917f] text-[15px] font-semibold text-white shadow-sm hover:bg-[#867c6c] disabled:opacity-60 cursor-pointer"
				onclick={handleSave}
				disabled={isLoading}
			>
				{#if isLoading}
					<span class="flex items-center gap-2">
						<span class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
						Menyimpan...
					</span>
				{:else}
					Simpan
				{/if}
			</Button>
		</div>
	{/snippet}
</BaseModal>
