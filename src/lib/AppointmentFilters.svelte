<script lang="ts">
  import { format, addDays, subDays, startOfMonth, endOfMonth, startOfDay, endOfDay } from 'date-fns';
  import { ptBR } from 'date-fns/locale';
  import { appointments } from './AppointmentStore';

  export let filterStatus: string = 'all';
  export let filterAtendimento: string = 'all';
  export let searchQuery: string = '';
  export let dateRange: { start: Date | null; end: Date | null } = { start: null, end: null };

  const statusOptions = ['all', 'Solicitada', 'Aprovada', 'Cancelada', 'Analize', 'Falta pedido', '-'];

  // Função para obter todos os tipos únicos de atendimento dos dados
  $: uniqueAtendimentos = ['all', ...[...new Set($appointments.map(a => a.atendimento))].sort()];

  function setDateRange(range: 'today' | '7days-future' | '7days-past' | 'current-month') {
    const today = new Date();
    
    switch (range) {
      case 'today':
        dateRange = { 
          start: startOfDay(today), 
          end: endOfDay(today) 
        };
        break;
      case '7days-future':
        dateRange = { 
          start: startOfDay(today), 
          end: endOfDay(addDays(today, 7))
        };
        break;
      case '7days-past':
        dateRange = { 
          start: startOfDay(subDays(today, 7)), 
          end: endOfDay(today)
        };
        break;
      case 'current-month':
        dateRange = {
          start: startOfMonth(today),
          end: endOfMonth(today)
        };
        break;
    }
  }

  function clearDateRange() {
    dateRange = { start: null, end: null };
  }

  function handleDateInput(event: Event, type: 'start' | 'end') {
    const input = event.target as HTMLInputElement;
    const date = input.value ? new Date(input.value) : null;
    
    if (type === 'start') {
      dateRange.start = date ? startOfDay(date) : null;
    } else {
      dateRange.end = date ? endOfDay(date) : null;
    }
    dateRange = { ...dateRange }; // Trigger reactivity
  }

  $: startDateString = dateRange.start ? format(dateRange.start, 'yyyy-MM-dd') : '';
  $: endDateString = dateRange.end ? format(dateRange.end, 'yyyy-MM-dd') : '';
</script>

<div class="bg-white shadow-md rounded-lg p-6 mb-8">
  <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
    <div>
      <label for="search" class="block text-sm font-medium text-gray-700">Buscar</label>
      <input
        type="text"
        id="search"
        bind:value={searchQuery}
        placeholder="Buscar por nome, email, whatsapp ou carteirinha..."
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      />
    </div>

    <div>
      <label for="status" class="block text-sm font-medium text-gray-700">Status da Guia</label>
      <select
        id="status"
        bind:value={filterStatus}
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      >
        {#each statusOptions as option}
          <option value={option}>{option === 'all' ? 'Todos' : option}</option>
        {/each}
      </select>
    </div>

    <div>
      <label for="atendimento" class="block text-sm font-medium text-gray-700">Tipo de Atendimento</label>
      <select
        id="atendimento"
        bind:value={filterAtendimento}
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      >
        {#each uniqueAtendimentos as option}
          <option value={option}>{option === 'all' ? 'Todos' : option}</option>
        {/each}
      </select>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Período</label>
      <div class="mt-1 grid grid-cols-2 gap-4">
        <input
          type="date"
          value={startDateString}
          on:input={(e) => handleDateInput(e, 'start')}
          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        <input
          type="date"
          value={endDateString}
          on:input={(e) => handleDateInput(e, 'end')}
          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
    </div>
  </div>

  <div class="mt-4 flex flex-wrap gap-2">
    <button
      on:click={() => setDateRange('today')}
      class="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200"
    >
      Hoje
    </button>
    <button
      on:click={() => setDateRange('7days-future')}
      class="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200"
    >
      Próximos 7 dias
    </button>
    <button
      on:click={() => setDateRange('7days-past')}
      class="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200"
    >
      Últimos 7 dias
    </button>
    <button
      on:click={() => setDateRange('current-month')}
      class="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200"
    >
      Mês atual
    </button>
    <button
      on:click={clearDateRange}
      class="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200"
    >
      Limpar filtro de data
    </button>
  </div>
</div>
