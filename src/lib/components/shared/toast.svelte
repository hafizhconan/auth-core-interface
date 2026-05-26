<script lang="ts" module>
	import { toast as svelteSonnerToast } from 'svelte-sonner';

	/**
	 * Konfigurasi properti untuk memanggil Toast.
	 */
	export interface ToastProps {
		/** Variant dari Toast: 'success', 'danger', 'info', atau 'question' */
		type: 'success' | 'danger' | 'info' | 'question';
		/** Teks judul utama pada Toast */
		title: string;
		/** Teks penjelasan deskriptif di bawah judul */
		message: string;
		/** Durasi timer (milidetik) sebelum Toast otomatis tertutup */
		duration?: number;
	}

	/**
	 * Helper function untuk menampilkan Toast secara terstandarisasi.
	 * Fungsi ini akan memanggil method bawaan svelte-sonner dengan
	 * mapping variant 'danger' ke error dan 'question' ke warning.
	 * 
	 * @example
	 * showToast({ type: 'success', title: 'Data Added', message: 'Saved.', duration: 5000 });
	 */
	export const showToast = (props: ToastProps) => {
		const options = { description: props.message, duration: props.duration };
		switch (props.type) {
			case 'success':
				return svelteSonnerToast.success(props.title, options);
			case 'danger':
				return svelteSonnerToast.error(props.title, options);
			case 'info':
				return svelteSonnerToast.info(props.title, options);
			case 'question':
				return svelteSonnerToast.warning(props.title, options);
		}
	};
</script>

<script lang="ts">
	import { Toaster as Sonner, type ToasterProps as SonnerProps } from 'svelte-sonner';

	// Import icon lokal
	import iconCheck from '$lib/assets/icons/toast/icon-check.svg';
	import iconClose from '$lib/assets/icons/toast/icon-close.svg';
	import iconInfo from '$lib/assets/icons/toast/icon-info.svg';
	import iconQuestion from '$lib/assets/icons/toast/icon-question.png';

	// Omit internal snippet props to avoid union type complexity in Svelte 5
	let { position = 'top-right', ...restProps }: Omit<SonnerProps, 'successIcon' | 'errorIcon' | 'infoIcon' | 'warningIcon' | 'loadingIcon'> = $props();
</script>

<!--
  Ini adalah wrapper global Toaster dari Shadcn (berbasis svelte-sonner) 
  yang dimodifikasi agar tampilannya mirip persis seperti desain.
  
  Agar berfungsi, pastikan me-render `<Toast />` di file root / +layout.svelte Anda
  (biasanya menggantikan Toaster bawaan shadcn).
-->

<Sonner
	class="toaster group"
	closeButton={true}
	{position}
	toastOptions={{
		classes: {
			toast: 'group !bg-[#454545] !border-none !shadow-lg rounded-lg p-4 !pr-12 flex items-start gap-4 min-w-[350px]',
			title: '!text-[15px] font-semibold !text-white tracking-tight leading-snug',
			description: '!text-[13px] !text-white leading-relaxed mt-1',
			icon: '!self-start !mt-[2px] flex h-[20px] w-[20px] shrink-0 items-center justify-center object-contain',
			closeButton:
				'!absolute !left-auto !translate-x-0 !translate-y-0 !right-2 !top-5 h-5 w-5 !bg-transparent rounded-full !border-none !text-white hover:!bg-[#FFFFFF20] hover:!text-white rounded-full transition-colors flex items-center justify-center opacity-70 hover:opacity-100'
		}
	}}
	{...restProps}
>
	<!-- Customizing Svelte-Sonner internal icons with local assets -->
	{#snippet successIcon()}
		<img src={iconCheck} alt="success" class="h-full w-full object-contain" />
	{/snippet}
	{#snippet errorIcon()}
		<!-- error digunakan sebagai 'danger' -->
		<img src={iconClose} alt="danger" class="h-full w-full object-contain" />
	{/snippet}
	{#snippet infoIcon()}
		<img src={iconInfo} alt="info" class="h-full w-full object-contain" />
	{/snippet}
	{#snippet warningIcon()}
		<!-- warning digunakan sebagai 'question' -->
		<img src={iconQuestion} alt="question" class="h-full w-full object-contain" />
	{/snippet}
</Sonner>
