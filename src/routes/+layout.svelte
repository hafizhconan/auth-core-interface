<script lang="ts">
	import { page } from '$app/state';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Toast from '$lib/components/shared/toast.svelte';

	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => {
		if (browser) {
			// Handle Fingerprint
			let fingerprint = localStorage.getItem('device_fingerprint');
			if (!fingerprint) {
				try {
					if (window.crypto && window.crypto.randomUUID) {
						fingerprint = window.crypto.randomUUID();
					} else {
						// Fallback for non-secure contexts
						fingerprint = Math.random().toString(36).substring(2, 15) + 
									  Math.random().toString(36).substring(2, 15);
					}
					localStorage.setItem('device_fingerprint', fingerprint);
				} catch (e) {
					console.error('Failed to generate device fingerprint:', e);
				}
			}

			// Handle Device Name and Platform
			let deviceName = localStorage.getItem('device_name');
			let platform = localStorage.getItem('platform');

			if (!deviceName || !platform) {
				const ua = navigator.userAgent;
				let detectedName = 'Web Browser';
				if (ua.includes('Chrome')) detectedName = 'Chrome';
				else if (ua.includes('Firefox')) detectedName = 'Firefox';
				else if (ua.includes('Safari') && !ua.includes('Chrome')) detectedName = 'Safari';
				else if (ua.includes('Edge')) detectedName = 'Edge';

				platform = 'web';
				deviceName = `${detectedName} on ${navigator.platform}`;

				localStorage.setItem('device_name', deviceName);
				localStorage.setItem('platform', platform);
			}
		}
	});
</script>

<svelte:head><link rel="icon" href={favicon} />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
<link
	href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;700&display=swap"
	rel="stylesheet"
/></svelte:head>
{@render children()}

<div style="display:none">
	{#each locales as locale (locale)}
		<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
		<a href={localizeHref(page.url.pathname, { locale })}>{locale}</a>
	{/each}
</div>
<Toast/>