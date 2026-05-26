<script lang="ts">
	import LoginForm from '$lib/components/form/login-form.svelte';
	import AuthBanner from '$lib/components/dashboard/auth-banner.svelte';

	let { data } = $props();

	const { form } = $derived(data);
</script>

<div class="flex min-h-screen w-full">
	<!-- Left Side -->
	<AuthBanner />

	<!-- Right Side -->
	<div class="relative flex w-full flex-col bg-[#FAFAFA] lg:w-[50%]">
		<div class="flex flex-1 items-center justify-center p-6 sm:p-12">
			<LoginForm {form} />
		</div>

		<!-- Footer text -->
		<div class="pb-10 text-center text-[13px] font-medium text-zinc-400">
			© 2026 International Visea School . All rights reserved.
		</div>
	</div>
</div>
