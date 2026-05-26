<script lang="ts">
	import AuthBanner from '$lib/components/dashboard/auth-banner.svelte';
	import ResetPasswordForm from '$lib/components/form/reset-password-form.svelte';
	import { page } from '$app/state';
</script>

<div class="flex min-h-screen w-full">
	<!-- Left Side -->
	<AuthBanner />

	<!-- Right Side -->
	<ResetPasswordForm token={page.url.searchParams.get('token') ?? ''} />
</div>
