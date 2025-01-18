<script lang="ts">
  import type { Appointment } from './types';
  import { appointments } from './AppointmentStore';
  import AppointmentCard from './AppointmentCard.svelte';
  import { isWithinInterval, parseISO, startOfDay, endOfDay } from 'date-fns';

  export let filterStatus: string = 'all';
  export let filterAtendimento: string = 'all';
  export let searchQuery: string = '';
  export let dateRange: { start: Date | null; end: Date | null } = { start: null, end: null };

  function sortAppointments(a: Appointment, b: Appointment): number {
    // Handle null dates - push them to the end
    if (!a.data_agendamento && !b.data_agendamento) {
      return 0;
    }
    if (!a.data_agendamento) return 1;
    if (!b.data_agendamento) return -1;

    // Compare dates
    const dateA = parseISO(a.data_agendamento);
    const dateB = parseISO(b.data_agendamento);
    const dateComparison = dateA.getTime() - dateB.getTime();

    // If dates are equal, sort by name as secondary criteria
    if (dateComparison === 0) {
      return a.nome.localeCompare(b.nome);
    }

    return dateComparison;
  }

  $: filteredAppointments = $appointments
    .filter(appointment => {
      if (filterStatus === 'all') return true;
      return filterStatus === appointment.guia;
    })
    .filter(appointment => {
      if (filterAtendimento === 'all') return true;
      return filterAtendimento === appointment.atendimento;
    })
    .filter(appointment => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        (appointment.nome?.toLowerCase().includes(query) || false) ||
        (appointment.email?.toLowerCase().includes(query) || false) ||
        (appointment.whatsapp?.toLowerCase().includes(query) || false) ||
        (appointment.num_carteirinha?.includes(query) || false) ||
        (appointment.atendimento?.toLowerCase().includes(query) || false)
      );
    })
    .filter(appointment => {
      if (!dateRange.start || !dateRange.end || !appointment.data_agendamento) return true;
      const appointmentDate = parseISO(appointment.data_agendamento);
      return isWithinInterval(appointmentDate, {
        start: dateRange.start,
        end: dateRange.end
      });
    })
    .sort(sortAppointments);
</script>

<div class="space-y-6">
  {#each filteredAppointments as appointment (appointment.id)}
    <AppointmentCard {appointment} />
  {/each}
</div>
