<script lang="ts">
	import type { User } from '$lib/types';
	let { user }: { user: User } = $props();
</script>

<div class="mb-10 w-full">
	<h1 class="text-[28px] font-bold tracking-tight text-white mb-2 sm:text-[32px]">
		Selamat Datang {user.display_name}!
	</h1>
	<p class="max-w-[800px] text-[15px] leading-relaxed text-[#D4D4D8] pr-4">
		Masuk ke berbagai platform Al Azhar dengan satu akun untuk mendukung aktivitas belajar dan administrasi.
	</p>
</div>
