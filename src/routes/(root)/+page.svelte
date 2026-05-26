<script lang="ts">
  import DashboardNavbar from '$lib/components/dashboard/dashboard-navbar.svelte';
  import DashboardHeader from '$lib/components/dashboard/dashboard-header.svelte';
  import DashboardTabs from '$lib/components/dashboard/dashboard-tabs.svelte';
  import AppCard from '$lib/components/dashboard/app-card.svelte';
  import bgImage from '$lib/assets/images/bg-root.png';
  import Cookies from 'js-cookie';
  import { PUBLIC_CMS_URL } from '$env/static/public';

  let { data } = $props();
  const { user } = data;

  function openCMS() {
    const token = Cookies.get('accessToken');
    const url = token ? `${PUBLIC_CMS_URL}?token=${encodeURIComponent(token)}` : PUBLIC_CMS_URL;
    window.open(url, '_blank');
  }

  const apps = [
    { name: 'CRM', desc: 'Pengelolaan data calon siswa dan komunikasi selama proses pendaftaran.', path: '/crm', onClick: null },
    { name: 'CMS', desc: 'Mengatur konten website seperti informasi, berita, & pengumuman.', path: null, onClick: openCMS },
    { name: 'Student AMS', desc: 'Sistem akademik untuk siswa, mencakup data belajar, jadwal, & aktivitas sekolah.', path: '/student-ams', onClick: null },
    { name: 'Teacher AMS', desc: 'Platform guru untuk mengelola kelas, materi, dan aktivitas pembelajaran.', path: '/teacher-ams', onClick: null },
    { name: 'School Admin', desc: 'Sistem administrasi utama, mengelola operasional sekolah secara menyeluruh.', path: '/school-admin', onClick: null },
    { name: 'Accounting', desc: 'Pengelolaan keuangan, termasuk pembayaran dan laporan finansial.', path: '/accounting', onClick: null },
    { name: 'Parking', desc: 'Sistem manajemen parkir untuk kendaraan di lingkungan sekolah.', path: '/parking', onClick: null }
  ];
</script>

<div class="relative min-h-screen w-full bg-[#111111] overflow-hidden font-sans">
  <!-- Background Image with Overlay -->
  <div class="absolute inset-0 z-0 bg-cover bg-center" style="background-image: url('{bgImage}');">
    <div class="absolute inset-0 bg-black/60 backdrop-blur-[1px]"></div>
  </div>

  <div class="relative z-10 flex h-full min-h-screen flex-col">
    <!-- Navbar Component -->
    <DashboardNavbar {user} />
    
    <!-- Main Content Area -->
    <main class="flex w-full flex-1 flex-col px-4 pb-16 pt-12 md:px-4">
      
      <!-- Header Welcome Text -->
      <DashboardHeader {user} />
      
      <!-- Category Tabs -->
      <DashboardTabs />
      
      <!-- App Grid Layout -->
      <div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {#each apps as app (app.name)}
          {#if app.onClick}
            <AppCard 
              title={app.name} 
              description={app.desc} 
              onclick={app.onClick}
              icon={app.name.toLowerCase().replace(' ', '-')} 
            />
          {:else}
            <AppCard 
              title={app.name} 
              description={app.desc} 
              href={app.path ?? '#'} 
              icon={app.name.toLowerCase().replace(' ', '-')} 
            />
          {/if}
        {/each}
      </div>
    </main>
  </div>
</div>
