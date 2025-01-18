export interface Appointment {
  id: number;
  nome: string;
  whatsapp: string | null;
  email: string | null;
  cpf: string | null;
  data_nascimento: string | null;
  num_carteirinha: string | null;
  guia: 'Solicitada' | 'Aprovada' | 'Cancelada' | 'Analize' | 'Falta pedido' | '-';
  consulta: 'Confirmada' | 'Realizada' | 'Cancelada' | 'Faltou' | '-';
  consulta_libera_apos: string | null;
  justificativa: string | null;
  cancelar_pedido_guia: 'Sim' | 'Não' | '-';
  atendimento: 
    | 'Unimed - Primeira Consulta'
    | 'Unimed - Retorno'
    | 'Fenix'
    | 'AMBEP'
    | 'Funserv'
    | 'Porto Seguro'
    | 'Programa Nutricional'
    | 'Primeira Consulta Particular'
    | 'Terapia Alimentar Adulto/Infantil'
    | 'Consulta Particular Online'
    | 'Terapia Alimentar Adulto/Infantil Online';
  foto_ped_medico?: string | null;
  foto_carteirinha?: string | null;
  aprovado: 'Sim' | 'Não' | '-';
  data_agendamento: string | null;
  created_at: string;
}
