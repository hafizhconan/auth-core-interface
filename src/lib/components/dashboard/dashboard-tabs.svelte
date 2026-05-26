<script lang="ts">
	const tabs = ['All Apps', 'Administrasi', 'E-Learning', 'Monitoring'];
	let activeTab = $state('All Apps');
</script>

<div class="w-full border-b border-[#FFFFFF33]">
	<div class="flex items-center gap-8 px-2">
		{#each tabs as tab (tab)}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_interactive_supports_focus -->
			<div
				class="relative cursor-pointer pb-[14px] text-[15px] transition-colors {activeTab === tab ? 'text-white font-medium' : 'text-[#A1A1AA] hover:text-[#E4E4E7]'}"
				onclick={() => (activeTab = tab)}
				role="button"
			>
				{tab}
				{#if activeTab === tab}
					<div class="absolute bottom-[-1px] left-0 h-[2px] w-full bg-white"></div>
				{/if}
			</div>
		{/each}
	</div>
</div>
