<script lang="ts">
	let {
		value = $bindable(['', '', '', '', '', '']),
		hasError = false,
		disabled = false,
		idPrefix = 'otp'
	}: {
		value?: string[];
		hasError?: boolean;
		disabled?: boolean;
		idPrefix?: string;
	} = $props();

	function handleInput(e: Event, index: number) {
		const input = e.target as HTMLInputElement;

		// Hanya izinkan digit
		input.value = input.value.replace(/\D/g, '');
		value[index] = input.value;

		if (input.value && index < value.length - 1) {
			const nextInput = input.parentElement?.children[index + 1] as HTMLInputElement;
			nextInput?.focus();
		}
	}

	function handleKeyDown(e: KeyboardEvent, index: number) {
		if (e.key === 'Backspace' && !value[index] && index > 0) {
			const prevInput = (e.currentTarget as HTMLElement).parentElement?.children[
				index - 1
			] as HTMLInputElement;
			prevInput?.focus();
		}
	}

	function handlePaste(e: ClipboardEvent) {
		e.preventDefault();
		const pasted = e.clipboardData?.getData('text').replace(/\D/g, '').slice(0, value.length) ?? '';
		pasted.split('').forEach((char, i) => {
			if (i < value.length) value[i] = char;
		});
		// Focus last filled input
		const lastIndex = Math.min(pasted.length, value.length - 1);
		const inputs = (e.target as HTMLElement).parentElement?.children;
		(inputs?.[lastIndex] as HTMLInputElement)?.focus();
	}
</script>

<div class="flex items-center justify-between gap-2">
	{#each value, i (i)}
		<input
			type="text"
			inputmode="numeric"
			pattern="[0-9]*"
			maxlength="1"
			bind:value={value[i]}
			oninput={(e) => handleInput(e, i)}
			onkeydown={(e) => handleKeyDown(e, i)}
			onpaste={handlePaste}
			{disabled}
			class="aspect-square w-full max-w-[52px] rounded-xl border text-center text-xl font-bold transition-all focus:outline-none focus:ring-2
				{hasError ? 'border-red-400 focus:ring-red-400' : 'border-zinc-300 focus:ring-zinc-800'}
				disabled:opacity-50 disabled:cursor-not-allowed"
			id="{idPrefix}-{i}"
		/>
	{/each}
</div>
