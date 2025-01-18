export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      appointments: {
        Row: {
          id: number
          created_at: string
          nome: string
          whatsapp: string | null
          email: string | null
          cpf: string | null
          data_nascimento: string | null
          num_carteirinha: string | null
          guia: string
          consulta: string
          consulta_libera_apos: string | null
          justificativa: string | null
          cancelar_pedido_guia: string
          atendimento: string
          foto_ped_medico: string | null
          foto_carteirinha: string | null
          aprovado: string
          data_agendamento: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          nome: string
          whatsapp?: string | null
          email?: string | null
          cpf?: string | null
          data_nascimento?: string | null
          num_carteirinha?: string | null
          guia: string
          consulta: string
          consulta_libera_apos?: string | null
          justificativa?: string | null
          cancelar_pedido_guia?: string
          atendimento: string
          foto_ped_medico?: string | null
          foto_carteirinha?: string | null
          aprovado?: string
          data_agendamento?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          nome?: string
          whatsapp?: string | null
          email?: string | null
          cpf?: string | null
          data_nascimento?: string | null
          num_carteirinha?: string | null
          guia?: string
          consulta?: string
          consulta_libera_apos?: string | null
          justificativa?: string | null
          cancelar_pedido_guia?: string
          atendimento?: string
          foto_ped_medico?: string | null
          foto_carteirinha?: string | null
          aprovado?: string
          data_agendamento?: string | null
        }
      }
    }
  }
}
