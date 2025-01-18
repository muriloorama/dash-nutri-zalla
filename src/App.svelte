<script lang="ts">
  import AppointmentList from './lib/AppointmentList.svelte';
  import AppointmentFilters from './lib/AppointmentFilters.svelte';
  import { appointments } from './lib/AppointmentStore';
  import { onMount } from 'svelte';

  let filterStatus = 'all';
  let filterAtendimento = 'all';
  let searchQuery = '';
  let dateRange = { start: null, end: null };

  onMount(() => {
    appointments.fetchAppointments();
  });
</script>

<main class="min-h-screen bg-gray-100 py-8 px-4 pb-24">
  <div class="max-w-7xl mx-auto">
    <div class="flex items-center gap-4 mb-8 bg-white p-6 rounded-lg shadow-md">
      <div class="p-3 bg-indigo-100 rounded-full">
        <svg class="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>
      <div>
        <h1 class="text-3xl font-bold text-gray-900 flex items-center gap-2">
          Painel Amanda Zalla
          <svg class="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </h1>
        <p class="text-sm text-gray-600 mt-1 flex items-center gap-2">
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Gerenciamento de Consultas e Agendamentos
        </p>
      </div>
    </div>
    
    <AppointmentFilters 
      bind:filterStatus 
      bind:filterAtendimento
      bind:searchQuery 
      bind:dateRange 
    />
    <AppointmentList 
      {filterStatus}
      {filterAtendimento}
      {searchQuery} 
      {dateRange} 
    />
  </div>
</main>

<style>
  :global(body) {
    background-color: #f3f4f6;
  }
</style>
