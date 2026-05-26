<script lang="ts">
	import bgLogin from '$lib/assets/images/bg-login.png';
	import logoAlAzhar from '$lib/assets/images/logo-al-azhar.png';
	import logoAlKabira from '$lib/assets/images/logo-al-kabira.png';
</script>

<div class="relative hidden w-[50%] flex-col justify-end bg-zinc-900 p-12 text-white lg:flex xl:p-16">
	<!-- Background Image with Overlay -->
	<div class="absolute inset-0 z-0 bg-cover bg-center" style="background-image: url('{bgLogin}');">
		<div class="absolute inset-0 bg-[#302B1DB2]"></div>
	</div>

	<!-- Content -->
	<div class="relative z-10 flex flex-col gap-2">
		<!-- Logos -->
		<div class="mb-4 flex gap-3">
			<img src={logoAlKabira} alt="Logo Al Kabira" class="h-10 w-10 object-contain rounded-full" />
			<img src={logoAlAzhar} alt="Logo Al Azhar" class="h-10 w-10 object-contain rounded-full bg-white" />
		</div>

		<h1 class="text-3xl font-bold tracking-tight text-white sm:text-[32px]">Sistem Informasi Akademik</h1>
		<h2 class="text-2xl font-semibold tracking-tight text-white/90 sm:text-[28px]">Yayasan Pesantren Islam Al Azhar</h2>
		<p class="mt-2 text-[15px] leading-relaxed text-zinc-200">
			Akses data siswa, jadwal, presensi, dan informasi<br>
			sekolah secara terintegrasi.
		</p>
	</div>
</div>
