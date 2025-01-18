<script lang="ts">
  import { appointments } from './AppointmentStore';
  import type { Appointment } from './types';

  let newAppointment: Omit<Appointment, 'id' | 'created_at'> = {
    nome: '',
    whatsapp: '',
    email: '',
    data_nascimento: '',
    num_carteirinha: '',
    guia: 'Solicitada',
    consulta: 'Confirmada',
    atendimento: 'Unimed - Primeira Consulta',
    foto_ped_medico: '',
    foto_carteirinha: '',
    aprovado: '-',
    data_agendamento: '',
    consulta_libera_apos: null,
    justificativa: null,
    cancelar_pedido_guia: '-',
    cpf: null
  };

  const guiaOptions = ['Solicitada', 'Aprovada', 'Cancelada', 'Analize', 'Falta pedido', '-'];
  const consultaOptions = ['Confirmada', 'Realizada', 'Cancelada', 'Faltou', '-'];
  const simNaoOptions = ['Sim', 'Não', '-'];
  const atendimentoOptions = [
    'Unimed - Primeira Consulta',
    'Unimed - Retorno',
    'Fenix',
    'AMBEP',
    'Funserv',
    'Porto Seguro',
    'Programa Nutricional',
    'Primeira Consulta Particular',
    'Terapia Alimentar Adulto/Infantil',
    'Consulta Particular Online',
    'Terapia Alimentar Adulto/Infantil Online'
  ];

  async function handleSubmit() {
    await appointments.addAppointment(newAppointment);

    // Reset form
    newAppointment = {
      nome: '',
      whatsapp: '',
      email: '',
      data_nascimento: '',
      num_carteirinha: '',
      guia: 'Solicitada',
      consulta: 'Confirmada',
      atendimento: 'Unimed - Primeira Consulta',
      foto_ped_medico: '',
      foto_carteirinha: '',
      aprovado: '-',
      data_agendamento: '',
      consulta_libera_apos: null,
      justificativa: null,
      cancelar_pedido_guia: '-',
      cpf: null
    };
  }
</script>

<form on:submit|preventDefault={handleSubmit} class="bg-white shadow-md rounded-lg p-6 mb-8">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <label for="nome" class="block text-sm font-medium text-gray-700">Nome</label>
      <input
        type="text"
        id="nome"
        bind:value={newAppointment.nome}
        required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      />
    </div>

    <div>
      <label for="whatsapp" class="block text-sm font-medium text-gray-700">WhatsApp</label>
      <input
        type="tel"
        id="whatsapp"
        bind:value={newAppointment.whatsapp}
        required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      />
    </div>

    <div>
      <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
      <input
        type="email"
        id="email"
        bind:value={newAppointment.email}
        required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      />
    </div>

    <div>
      <label for="data_nascimento" class="block text-sm font-medium text-gray-700">Data de Nascimento</label>
      <input
        type="date"
        id="data_nascimento"
        bind:value={newAppointment.data_nascimento}
        required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      />
    </div>

    <div>
      <label for="num_carteirinha" class="block text-sm font-medium text-gray-700">Número da Carteirinha</label>
      <input
        type="text"
        id="num_carteirinha"
        bind:value={newAppointment.num_carteirinha}
        required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      />
    </div>

    <div>
      <label for="guia" class="block text-sm font-medium text-gray-700">Guia</label>
      <select
        id="guia"
        bind:value={newAppointment.guia}
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      >
        {#each guiaOptions as option}
          <option value={option}>{option}</option>
        {/each}
      </select>
    </div>

    <div>
      <label for="consulta" class="block text-sm font-medium text-gray-700">Consulta</label>
      <select
        id="consulta"
        bind:value={newAppointment.consulta}
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      >
        {#each consultaOptions as option}
          <option value={option}>{option}</option>
        {/each}
      </select>
    </div>

    <div>
      <label for="aprovado" class="block text-sm font-medium text-gray-700">Aprovado</label>
      <select
        id="aprovado"
        bind:value={newAppointment.aprovado}
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      >
        {#each simNaoOptions as option}
          <option value={option}>{option}</option>
        {/each}
      </select>
    </div>

    <div>
      <label for="cancelar_pedido_guia" class="block text-sm font-medium text-gray-700">Cancelar Pedido</label>
      <select
        id="cancelar_pedido_guia"
        bind:value={newAppointment.cancelar_pedido_guia}
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      >
        {#each simNaoOptions as option}
          <option value={option}>{option}</option>
        {/each}
      </select>
    </div>

    <div>
      <label for="atendimento" class="block text-sm font-medium text-gray-700">Tipo de Atendimento</label>
      <select
        id="atendimento"
        bind:value={newAppointment.atendimento}
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      >
        {#each atendimentoOptions as option}
          <option value={option}>{option}</option>
        {/each}
      </select>
    </div>

    <div>
      <label for="foto_ped_medico" class="block text-sm font-medium text-gray-700">Link do Pedido Médico</label>
      <input
        type="url"
        id="foto_ped_medico"
        bind:value={newAppointment.foto_ped_medico}
        placeholder="https://exemplo.com/pedido.jpg"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      />
    </div>

    <div>
      <label for="foto_carteirinha" class="block text-sm font-medium text-gray-700">Link da Carteirinha</label>
      <input
        type="url"
        id="foto_carteirinha"
        bind:value={newAppointment.foto_carteirinha}
        placeholder="https://exemplo.com/carteirinha.jpg"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      />
    </div>

    <div>
      <label for="data_agendamento" class="block text-sm font-medium text-gray-700">Data do Agendamento</label>
      <input
        type="datetime-local"
        id="data_agendamento"
        bind:value={newAppointment.data_agendamento}
        required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      />
    </div>
  </div>

  <div class="mt-6">
    <button
      type="submit"
      class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    >
      Adicionar Agendamento
    </button>
  </div>
</form>
