<script lang="ts">
    import BaseModal from "$lib/components/shared/base-modal.svelte";
    import { Input } from "$lib/components/ui/input/index";
    import { Button } from "$lib/components/ui/button/index";
    import IdCard from "@lucide/svelte/icons/id-card";
    import { authService } from "$lib/api/services/auth-service";
    import { showToast } from "$lib/components/shared/toast.svelte";
    import { isNotFoundError, parseApiError } from "$lib/utils";

    let { open = $bindable(false) } = $props();

    let accountInfo = $state("");
    let accountInfoError = $state("");
    let isLoading = $state(false);

    function handleCancel() {
        open = false;
        resetForm();
    }

    function resetForm() {
        accountInfo = "";
        accountInfoError = "";
        isLoading = false;
    }

    async function handleContinue() {
        accountInfoError = "";

        if (!accountInfo.trim()) {
            accountInfoError = "Email tidak boleh kosong.";
            return;
        }

        isLoading = true;

        try {
            const response = await authService.requestForgotPassword({ email: accountInfo.trim() });
            console.log("requestForgotPassword response:", response);

            showToast({
                type: 'success',
                title: 'Berhasil',
                message: response.message ?? "Permintaan berhasil dikirim.",
                duration: 5000
            });

            open = false;
            resetForm();
        } catch (err) {
            const { status, message } = parseApiError(err);
            console.error("requestForgotPassword error:", err);

            if (isNotFoundError(err)) {
                accountInfoError = "Email tidak ditemukan. Pastikan email yang Anda masukkan sudah terdaftar.";
            } else if (status === 422) {
                accountInfoError = "Format email tidak valid.";
            } else {
                accountInfoError = message || "Terjadi kesalahan. Silakan coba beberapa saat lagi.";
            }
        } finally {
            isLoading = false;
        }
    }

    function handleInput() {
        if (accountInfoError) accountInfoError = "";
    }
</script>

<BaseModal
    bind:open
    title="Lupa Kata Sandi"
    contentClass="w-full max-w-[420px]"
    onOpenChange={(val) => { if (!val) resetForm(); }}
>
    {#snippet content()}
        <div class="flex flex-col gap-5">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F4F4F5]">
                <IdCard class="h-5 w-5 text-zinc-600" strokeWidth={1.5} />
            </div>

            <p class="text-[15px] font-semibold leading-relaxed text-[#333333]">
                Masukkan Email untuk menemukan akun Anda.
            </p>

            <div class="space-y-2">
                <label for="account-info" class="text-[13px] font-bold text-[#333333]">
                    Informasi Akun
                </label>
                <Input
                    id="account-info"
                    type="email"
                    bind:value={accountInfo}
                    oninput={handleInput}
                    placeholder="contoh: user@email.com"
                    disabled={isLoading}
                    class="h-11 rounded-lg border-zinc-200 bg-white text-[#333333] placeholder:text-zinc-400 shadow-sm
                        {accountInfoError ? 'border-red-400 focus-visible:ring-red-400' : ''}"
                />
                {#if accountInfoError}
                    <p class="text-[12px] font-medium text-red-500">{accountInfoError}</p>
                {:else}
                    <p class="text-[13px] text-zinc-500">
                        Belum menerima akun? Hubungi admin sekolah.
                    </p>
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
                onclick={handleContinue}
                disabled={isLoading}
            >
                {#if isLoading}
                    <span class="flex items-center gap-2">
                        <span class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                        Memproses...
                    </span>
                {:else}
                    Lanjutkan
                {/if}
            </Button>
        </div>
    {/snippet}
</BaseModal>
