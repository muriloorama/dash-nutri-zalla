<script lang="ts">
  import { fade } from 'svelte/transition';
  import { format, parseISO } from 'date-fns';
  import { ptBR } from 'date-fns/locale';
  import type { Appointment } from './types';
  import { appointments } from './AppointmentStore';

  export let appointment: Appointment;

  let showGuiaDropdown = false;
  let showConsultaDropdown = false;
  let showCancelarDropdown = false;
  let showAprovadoDropdown = false;
  
  let dateInputValue = '';

  $: {
    if (appointment.consulta_libera_apos) {
      try {
        const date = parseISO(appointment.consulta_libera_apos);
        dateInputValue = format(date, "yyyy-MM-dd'T'HH:mm");
      } catch (e) {
        console.error('Error parsing date:', e);
        dateInputValue = '';
      }
    } else {
      dateInputValue = '';
    }
  }

  const guiaOptions = ['Solicitada', 'Aprovada', 'Cancelada', 'Analize', 'Falta pedido', '-'];
  const consultaOptions = ['Confirmada', 'Realizada', 'Cancelada', 'Faltou', '-'];
  const simNaoOptions = ['Sim', 'Não', '-'];

  function formatDate(date: string | null): string {
    if (!date) return '-';
    try {
      return format(parseISO(date), "dd/MM/yyyy HH:mm", { locale: ptBR });
    } catch (e) {
      console.error('Error formatting date:', e);
      return '-';
    }
  }

  async function updateGuia(newValue: string) {
    await appointments.updateAppointment(appointment.id, { guia: newValue });
    showGuiaDropdown = false;
  }

  async function updateConsulta(newValue: string) {
    await appointments.updateAppointment(appointment.id, { consulta: newValue });
    showConsultaDropdown = false;
  }

  async function updateCancelarPedido(newValue: string) {
    await appointments.updateAppointment(appointment.id, { cancelar_pedido_guia: newValue });
    showCancelarDropdown = false;
  }

  async function updateAprovado(newValue: string) {
    await appointments.updateAppointment(appointment.id, { aprovado: newValue });
    showAprovadoDropdown = false;
  }

  async function updateLiberarAgenda() {
    if (!dateInputValue) return;
    
    try {
      const date = new Date(dateInputValue);
      const isoDate = date.toISOString();
      
      await appointments.updateAppointment(appointment.id, { 
        consulta_libera_apos: isoDate
      });
    } catch (e) {
      console.error('Error updating date:', e);
    }
  }

  function handleDateInput(event: Event) {
    const input = event.target as HTMLInputElement;
    dateInputValue = input.value;
  }

  function getStatusColor(status: string): string {
    switch (status) {
      case 'Sim':
        return 'bg-green-100 text-green-800';
      case 'Não':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  function getGuiaColor(status: string): string {
    switch (status) {
      case 'Solicitada':
        return 'bg-yellow-100 text-yellow-800';
      case 'Aprovada':
        return 'bg-green-100 text-green-800';
      case 'Cancelada':
        return 'bg-red-100 text-red-800';
      case 'Analize':
        return 'bg-blue-100 text-blue-800';
      case 'Falta pedido':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  function getConsultaColor(status: string): string {
    switch (status) {
      case 'Realizada':
        return 'bg-green-100 text-green-800';
      case 'Confirmada':
        return 'bg-blue-100 text-blue-800';
      case 'Cancelada':
        return 'bg-red-100 text-red-800';
      case 'Faltou':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
</script>

<div class="bg-white rounded-lg shadow-md overflow-visible mb-8 pb-6" transition:fade>
  <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-semibold text-gray-900">{appointment.nome}</h3>
      <div class="flex items-center gap-4">
        <div class="relative inline-block">
          <button
            on:click={() => showGuiaDropdown = !showGuiaDropdown}
            class="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium {getGuiaColor(appointment.guia)}"
          >
            Guia: {appointment.guia}
            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {#if showGuiaDropdown}
            <div
              class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
              transition:fade
            >
              <div class="py-1">
                {#each guiaOptions as option}
                  <button
                    class="block w-full px-4 py-2 text-sm text-left hover:bg-gray-50 {getGuiaColor(option)}"
                    on:click={() => updateGuia(option)}
                  >
                    {option}
                  </button>
                {/each}
              </div>
            </div>
          {/if}
        </div>

        <div class="relative inline-block">
          <button
            on:click={() => showConsultaDropdown = !showConsultaDropdown}
            class="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium {getConsultaColor(appointment.consulta)}"
          >
            Consulta: {appointment.consulta}
            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {#if showConsultaDropdown}
            <div
              class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
              transition:fade
            >
              <div class="py-1">
                {#each consultaOptions as option}
                  <button
                    class="block w-full px-4 py-2 text-sm text-left hover:bg-gray-50 {getConsultaColor(option)}"
                    on:click={() => updateConsulta(option)}
                  >
                    {option}
                  </button>
                {/each}
              </div>
            </div>
          {/if}
        </div>

        <div class="relative inline-block">
          <button
            on:click={() => showCancelarDropdown = !showCancelarDropdown}
            class="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium {getStatusColor(appointment.cancelar_pedido_guia)}"
          >
            Cancelar Pedido: {appointment.cancelar_pedido_guia}
            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {#if showCancelarDropdown}
            <div
              class="absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
              transition:fade
            >
              <div class="py-1">
                {#each simNaoOptions as option}
                  <button
                    class="block w-full px-4 py-2 text-sm text-left hover:bg-gray-50 {getStatusColor(option)}"
                    on:click={() => updateCancelarPedido(option)}
                  >
                    {option}
                  </button>
                {/each}
              </div>
            </div>
          {/if}
        </div>

        <div class="relative inline-block">
          <button
            on:click={() => showAprovadoDropdown = !showAprovadoDropdown}
            class="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium {getStatusColor(appointment.aprovado)}"
          >
            Aprovado: {appointment.aprovado}
            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {#if showAprovadoDropdown}
            <div
              class="absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
              transition:fade
            >
              <div class="py-1">
                {#each simNaoOptions as option}
                  <button
                    class="block w-full px-4 py-2 text-sm text-left hover:bg-gray-50 {getStatusColor(option)}"
                    on:click={() => updateAprovado(option)}
                  >
                    {option}
                  </button>
                {/each}
              </div>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>

  <div class="px-6 py-4">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div>
        <p class="text-sm font-medium text-gray-500 flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          Atendimento
        </p>
        <p class="mt-1 text-sm text-gray-900 bg-indigo-50 px-3 py-1.5 rounded-md">{appointment.atendimento}</p>
      </div>

      <div>
        <p class="text-sm font-medium text-gray-500 flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Data do Agendamento
        </p>
        <p class="mt-1 text-sm text-gray-900">{formatDate(appointment.data_agendamento)}</p>
      </div>

      <div>
        <p class="text-sm font-medium text-gray-500 flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Liberar Agenda
        </p>
        <div class="mt-1 flex items-center gap-2">
          <input
            type="datetime-local"
            value={dateInputValue}
            on:input={handleDateInput}
            class="text-sm rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
          <button
            on:click={updateLiberarAgenda}
            class="inline-flex items-center px-2 py-1 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Salvar
          </button>
        </div>
        <p class="mt-1 text-sm text-gray-500">
          Data atual: {formatDate(appointment.consulta_libera_apos)}
        </p>
      </div>

      <div>
        <p class="text-sm font-medium text-gray-500 flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          WhatsApp
        </p>
        <p class="mt-1 text-sm text-gray-900">{appointment.whatsapp || '-'}</p>
      </div>

      <div>
        <p class="text-sm font-medium text-gray-500 flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Email
        </p>
        <p class="mt-1 text-sm text-gray-900">{appointment.email || '-'}</p>
      </div>

      <div>
        <p class="text-sm font-medium text-gray-500 flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
          </svg>
          CPF
        </p>
        <p class="mt-1 text-sm text-gray-900">{appointment.cpf || '-'}</p>
      </div>

      <div>
        <p class="text-sm font-medium text-gray-500 flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
          </svg>
          Data de Nascimento
        </p>
        <p class="mt-1 text-sm text-gray-900">{formatDate(appointment.data_nascimento)}</p>
      </div>

      <div>
        <p class="text-sm font-medium text-gray-500 flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
          </svg>
          Número da Carteirinha
        </p>
        <p class="mt-1 text-sm text-gray-900">{appointment.num_carteirinha || '-'}</p>
      </div>

      <div>
        <p class="text-sm font-medium text-gray-500 flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
          Justificativa
        </p>
        <p class="mt-1 text-sm text-gray-900">{appointment.justificativa || '-'}</p>
      </div>

      {#if appointment.foto_ped_medico}
        <div>
          <p class="text-sm font-medium text-gray-500 flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Pedido Médico
          </p>
          <a
            href={appointment.foto_ped_medico}
            target="_blank"
            rel="noopener noreferrer"
            class="mt-1 inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Ver imagem
          </a>
        </div>
      {/if}

      {#if appointment.foto_carteirinha}
        <div>
          <p class="text-sm font-medium text-gray-500 flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V .75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
            </svg>
            Carteirinha
          </p>
          <a
            href={appointment.foto_carteirinha}
            target="_blank"
            rel="noopener noreferrer"
            class="mt-1 inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Ver imagem
          </a>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  :global(body) {
    overflow-x: hidden;
  }
  
  .relative {
    position: relative;
  }

  /* Ensure dropdowns are always on top */
  .z-50 {
    z-index: 50;
  }

  /* Add some spacing for the dropdowns */
  .mb-8 {
    margin-bottom: 2rem;
  }
</style>
