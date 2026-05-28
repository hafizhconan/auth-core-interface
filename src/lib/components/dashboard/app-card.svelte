<script lang="ts">
	import {
		Inbox, Layout, BookOpen, GraduationCap, Wallet, CarFront, ArrowUpRight, Network, Library, Lock
	} from '@lucide/svelte';
	import { localizeHref as resolve } from '$lib/paraglide/runtime';

	let { title, description, href, icon, onclick, disabled = false }: { 
		title: string; 
		description: string; 
		href?: string | null; 
		icon: string; 
		onclick?: (() => void) | null;
		disabled?: boolean;
	} = $props();

	let finalClass = $derived(
		"group relative flex h-[280px] w-full flex-col overflow-hidden rounded-[24px] border p-6 backdrop-blur-3xl transition-all " +
		(disabled 
			? "border-[#FFFFFF0D] bg-[#2E2E2EB2]/10 cursor-not-allowed opacity-80" 
			: "border-[#FFFFFF1A] bg-[#454545B2]/30 hover:bg-[#FFFFFF0D] focus:outline-none cursor-pointer")
	);
</script>

{#if onclick}
<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
<button type="button" onclick={disabled ? undefined : onclick} disabled={disabled} class={finalClass}>
	<!-- App Icon Area -->
	<div class="mb-auto flex h-[102px] w-full items-center justify-center rounded-2xl bg-[#FFFFFF0A] transition-colors {disabled ? '' : 'group-hover:bg-[#FFFFFF14]'}">
		{#if icon.includes('crm')}
			<Inbox class="h-[42px] w-[42px] text-white" strokeWidth={2.5} />
		{:else if icon.includes('cms')}
			<Network class="h-[42px] w-[42px] text-white" strokeWidth={2.5} />
		{:else if icon.includes('student')}
			<BookOpen class="h-[42px] w-[42px] text-white" strokeWidth={2.5} />
		{:else if icon.includes('teacher')}
			<GraduationCap class="h-[42px] w-[42px] text-white" strokeWidth={2.5} />
		{:else if icon.includes('school')}
			<Library class="h-[42px] w-[42px] text-white" strokeWidth={2.5} />
		{:else if icon.includes('account')}
			<Wallet class="h-[42px] w-[42px] text-white" strokeWidth={2.5} />
		{:else if icon.includes('parking')}
			<CarFront class="h-[42px] w-[42px] text-white" strokeWidth={2.5} />
		{:else}
			<Layout class="h-[42px] w-[42px] text-white" strokeWidth={2.5} />
		{/if}
	</div>

	<!-- Bottom Section -->
	<div class="mt-8 flex flex-col justify-end text-left">
		<h3 class="mb-2 text-[17px] font-semibold tracking-tight text-white">{title}</h3>
		<p class="text-[13px] leading-relaxed text-[#A1A1AA] line-clamp-2 max-w-[80%]">
			{description}
		</p>
	</div>

	<!-- Top Right Arrow Circle Icon or Lock Icon -->
	{#if disabled}
		<div class="absolute bottom-[38px] right-6 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-[#FFFFFF1A]">
			<Lock class="h-3 w-3 text-zinc-400" strokeWidth={3} />
		</div>
	{:else}
		<div class="absolute bottom-[38px] right-6 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-white transition-transform group-hover:scale-110">
			<ArrowUpRight class="h-3.5 w-3.5 text-black" strokeWidth={3} />
		</div>
	{/if}
</button>
{:else}
<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
<a href={disabled ? undefined : resolve(href ?? '/')} class={finalClass} onclick={disabled ? (e) => e.preventDefault() : undefined}>
	<!-- App Icon Area -->
	<div class="mb-auto flex h-[102px] w-full items-center justify-center rounded-2xl bg-[#FFFFFF0A] transition-colors {disabled ? '' : 'group-hover:bg-[#FFFFFF14]'}">
		{#if icon.includes('crm')}
			<Inbox class="h-[42px] w-[42px] text-white" strokeWidth={2.5} />
		{:else if icon.includes('cms')}
			<Network class="h-[42px] w-[42px] text-white" strokeWidth={2.5} />
		{:else if icon.includes('student')}
			<BookOpen class="h-[42px] w-[42px] text-white" strokeWidth={2.5} />
		{:else if icon.includes('teacher')}
			<GraduationCap class="h-[42px] w-[42px] text-white" strokeWidth={2.5} />
		{:else if icon.includes('school')}
			<Library class="h-[42px] w-[42px] text-white" strokeWidth={2.5} />
		{:else if icon.includes('account')}
			<Wallet class="h-[42px] w-[42px] text-white" strokeWidth={2.5} />
		{:else if icon.includes('parking')}
			<CarFront class="h-[42px] w-[42px] text-white" strokeWidth={2.5} />
		{:else}
			<Layout class="h-[42px] w-[42px] text-white" strokeWidth={2.5} />
		{/if}
	</div>

	<!-- Bottom Section -->
	<div class="mt-8 flex flex-col justify-end">
		<h3 class="mb-2 text-[17px] font-semibold tracking-tight text-white">{title}</h3>
		<p class="text-[13px] leading-relaxed text-[#A1A1AA] line-clamp-2 max-w-[80%]">
			{description}
		</p>
	</div>

	<!-- Top Right Arrow Circle Icon or Lock Icon -->
	{#if disabled}
		<div class="absolute bottom-[38px] right-6 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-[#FFFFFF1A]">
			<Lock class="h-3 w-3 text-zinc-400" strokeWidth={3} />
		</div>
	{:else}
		<div class="absolute bottom-[38px] right-6 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-white transition-transform group-hover:scale-110">
			<ArrowUpRight class="h-3.5 w-3.5 text-black" strokeWidth={3} />
		</div>
	{/if}
</a>
{/if}
