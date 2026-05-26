<script lang="ts">
	import { Input } from '$lib/components/ui/input/index';
	import { Search, Bell, ChevronDown, LogOut, User as UserIcon, Settings } from '@lucide/svelte';
	import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar/index';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index';
	import type { User } from '$lib/types';

	let { user }: { user: User } = $props();

	// Function to get initials from display name
	const getInitials = (name: string) => {
		return name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase()
			.substring(0, 2);
	};
</script>

<nav class="sticky top-0 z-50 flex h-16 items-center justify-between px-4">
	<!-- Left: Breadcrumb -->
	<div class="flex items-center text-sm font-medium">
		<span class="text-zinc-400">SSO</span>
		<span class="mx-2 text-zinc-500">/</span>
		<span class="text-white">Dashboard</span>
	</div>

	<!-- Center: Search Input -->
	<div class="hidden flex-1 items-center justify-center md:flex">
		<div class="relative w-full max-w-[440px]">
			<Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
			<Input
				type="text"
				placeholder="Cari Sesuatu"
				class="h-10 w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-12 text-[13px] text-white placeholder-zinc-400 ring-offset-zinc-950 focus-visible:ring-zinc-800"
			/>
			<div class="absolute right-2 top-1/2 flex -translate-y-1/2 items-center justify-center rounded bg-white px-2 py-1 text-[10px] font-medium">
				/
			</div>
		</div>
	</div>

	<!-- Right: Actions -->
	<div class="flex items-center gap-6">
		<button class="relative text-zinc-400 transition-colors hover:text-white">
			<Bell class="h-[22px] w-[22px]" />
			<span class="absolute right-0 top-0 h-2 w-2 rounded-full border border-black bg-red-500"></span>
		</button>

		<DropdownMenu.Root>
			<DropdownMenu.Trigger class="flex items-center gap-3 transition-opacity hover:opacity-80 focus:outline-none focus-visible:outline-none">
				<!-- User Avatar Placeholder -->
				<Avatar class="h-9 w-9 overflow-hidden rounded-full border border-white/10 bg-zinc-800">
					<AvatarImage src={user.avatar_url || ''} alt={user.display_name} />
					<AvatarFallback class="text-xs font-semibold text-white">{getInitials(user.display_name)}</AvatarFallback>
				</Avatar>
				<div class="hidden text-left sm:block">
					<p class="text-sm font-semibold leading-none text-white tracking-tight">{user.display_name}</p>
					<p class="mt-1 text-xs text-zinc-400 font-medium">Super Admin</p>
				</div>
				<ChevronDown class="h-4 w-4 text-zinc-400 ml-1" />
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end" class="w-56 mt-2 rounded-xl border border-white/10 bg-[#1A1A1A] p-1.5 text-white shadow-2xl backdrop-blur-xl">
				<DropdownMenu.Label class="px-2 py-2 text-[12px] font-medium text-zinc-500 uppercase tracking-wider">Akun Saya</DropdownMenu.Label>
				<DropdownMenu.Separator class="my-1 h-px bg-white/5" />
				<DropdownMenu.Group>
					<DropdownMenu.Item class="flex items-center rounded-lg px-2 py-2.5 text-sm transition-colors hover:bg-white/5 cursor-pointer">
						<UserIcon class="mr-3 h-4 w-4 text-zinc-400" />
						<span>Profil</span>
					</DropdownMenu.Item>
					<DropdownMenu.Item class="flex items-center rounded-lg px-2 py-2.5 text-sm transition-colors hover:bg-white/5 cursor-pointer">
						<Settings class="mr-3 h-4 w-4 text-zinc-400" />
						<span>Pengaturan</span>
					</DropdownMenu.Item>
				</DropdownMenu.Group>
				<DropdownMenu.Separator class="my-1 h-px bg-white/5" />
				<DropdownMenu.Item class="flex items-center rounded-lg px-0 py-0 text-sm transition-colors hover:bg-red-500/10 text-red-400 cursor-pointer focus:bg-red-500/10 focus:text-red-400">
					<form action="/logout" method="POST" class="flex w-full">
						<button type="submit" class="flex w-full items-center px-2 py-2.5 text-left">
							<LogOut class="mr-3 h-4 w-4" />
							<span>Keluar</span>
						</button>
					</form>
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
</nav>
