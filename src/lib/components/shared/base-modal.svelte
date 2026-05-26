<script lang="ts">
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import { cn } from "$lib/utils.js";
    import X from "@lucide/svelte/icons/x";
    import type { Snippet } from "svelte";

    let {
        open = $bindable(false),
        title,
        description,
        trigger,
        content,
        footer,
        contentClass,
        onOpenChange,
        showCloseButton = true, // Whether to show custom styled close button
    }: {
        open?: boolean;
        title?: string;
        description?: string;
        trigger?: Snippet;
        content?: Snippet;
        footer?: Snippet;
        contentClass?: string;
        onOpenChange?: (open: boolean) => void;
        showCloseButton?: boolean;
    } = $props();
</script>

<Dialog.Root bind:open {onOpenChange}>
    {#if trigger}
        <Dialog.Trigger>
            {@render trigger()}
        </Dialog.Trigger>
    {/if}
    <!-- We set showCloseButton to false on Shadcn's Content and provide our own custom close button below -->
    <Dialog.Content class={cn("sm:max-w-md gap-0 p-0", contentClass)} showCloseButton={false}>
        {#if showCloseButton}
            <Dialog.Close
                class="absolute right-4 top-4 rounded-full bg-[#3d3d3d] p-1.5 text-white transition-colors hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            >
                <X class="h-4 w-4" />
                <span class="sr-only">Close</span>
            </Dialog.Close>
        {/if}
        <Dialog.Header class="mb-4 border-b p-4">
            {#if title}
                <Dialog.Title class="text-[20px] font-bold text-[#333333]">{title}</Dialog.Title>
            {/if}
            {#if description}
                <Dialog.Description>{description}</Dialog.Description>
            {/if}
        </Dialog.Header>

        {#if content}
            <div class="p-4">
                {@render content()}
            </div>
        {/if}

        {#if footer}
            <Dialog.Footer class="mt-8 p-4 flex w-full justify-between sm:justify-between items-center bg-transparent gap-3 sm:gap-3">
                {@render footer()}
            </Dialog.Footer>
        {/if}
    </Dialog.Content>
</Dialog.Root>
