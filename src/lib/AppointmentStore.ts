import { writable } from 'svelte/store';
import type { Appointment } from './types';
import { supabase } from './supabase';

const WEBHOOK_URL = 'https://flow.oramatech.com.br/webhook/2f549d8b-d430-43d6-870b-28bf7596de4e';

async function sendWebhook(appointmentId: number, tipo: string, value: string) {
  const payload = {
    tipo, // tipo pode ser: 'guia', 'consulta', 'cancelar_pedido_guia', 'aprovado'
    value, // valor específico do tipo (ex: 'Aprovada', 'Confirmada', 'Sim', 'Não')
    appointment_id: appointmentId
  };

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.error('Webhook failed:', await response.text());
    } else {
      console.log('Webhook sent successfully:', payload);
    }
  } catch (error) {
    console.error('Error sending webhook:', error);
  }
}

function createAppointmentStore() {
  const { subscribe, set, update } = writable<Appointment[]>([]);

  return {
    subscribe,
    
    async fetchAppointments() {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('data_agendamento', { ascending: true });

      if (error) {
        console.error('Error fetching appointments:', error);
        return;
      }

      set(data);
    },

    async updateAppointment(id: number, updates: Partial<Appointment>) {
      const { data, error } = await supabase
        .from('appointments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating appointment:', error);
        return;
      }

      // Send webhook for specific field updates with clear type identification
      if ('guia' in updates) {
        await sendWebhook(id, 'guia', updates.guia as string);
      }
      if ('consulta' in updates) {
        await sendWebhook(id, 'consulta', updates.consulta as string);
      }
      if ('cancelar_pedido_guia' in updates) {
        await sendWebhook(id, 'cancelar_pedido_guia', updates.cancelar_pedido_guia as string);
      }
      if ('aprovado' in updates) {
        await sendWebhook(id, 'aprovado', updates.aprovado as string);
      }

      // Update the local store with the returned data from the database
      update(appointments => 
        appointments.map(appointment => 
          appointment.id === id ? { ...appointment, ...data } : appointment
        )
      );
    },

    async addAppointment(newAppointment: Omit<Appointment, 'id' | 'created_at'>) {
      const { data, error } = await supabase
        .from('appointments')
        .insert([newAppointment])
        .select()
        .single();

      if (error) {
        console.error('Error adding appointment:', error);
        return;
      }

      update(appointments => [...appointments, data]);
    },

    async deleteAppointment(id: number) {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting appointment:', error);
        return;
      }

      update(appointments => appointments.filter(a => a.id !== id));
    }
  };
}

export const appointments = createAppointmentStore();
