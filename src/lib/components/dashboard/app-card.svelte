<script lang="ts">
	import { 
		Inbox, Layout, BookOpen, GraduationCap, Wallet, CarFront, ArrowUpRight, Network, Library 
	} from '@lucide/svelte';
	import { localizeHref as resolve } from '$lib/paraglide/runtime';

	let { title, description, href, icon, onclick }: { 
		title: string; 
		description: string; 
		href?: string | null; 
		icon: string; 
		onclick?: (() => void) | null;
	} = $props();

	const cardClass = "group relative flex h-[280px] w-full flex-col overflow-hidden rounded-[24px] border border-[#FFFFFF1A] bg-[#454545B2]/30 p-6 backdrop-blur-3xl transition-colors hover:bg-[#FFFFFF0D] focus:outline-none cursor-pointer";
</script>

{#if onclick}
<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
<button type="button" onclick={onclick} class={cardClass}>
	<!-- App Icon Area -->
	<div class="mb-auto flex h-[102px] w-full items-center justify-center rounded-2xl bg-[#FFFFFF0A] transition-colors group-hover:bg-[#FFFFFF14]">
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

	<div class="absolute bottom-[38px] right-6 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-white transition-transform group-hover:scale-110">
		<ArrowUpRight class="h-3.5 w-3.5 text-black" strokeWidth={3} />
	</div>
</button>
{:else}
<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
<a href={resolve(href ?? '/')} class={cardClass}>
	<!-- App Icon Area -->
	<div class="mb-auto flex h-[102px] w-full items-center justify-center rounded-2xl bg-[#FFFFFF0A] transition-colors group-hover:bg-[#FFFFFF14]">
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

	<!-- Top Right Arrow Circle Icon (positioned at middle-right slightly below icon container conceptually, but we match mockup layout where it is absolute at the right edge beside the title) -->
	<!-- Wait, looking at mockup, the white circle arrow is at the right edge, vertically aligned with the title! -->
	<div class="absolute bottom-[38px] right-6 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-white transition-transform group-hover:scale-110">
		<ArrowUpRight class="h-3.5 w-3.5 text-black" strokeWidth={3} />
	</div>
</a>
{/if}
