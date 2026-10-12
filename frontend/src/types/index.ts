export const Recorrencia = {
  Diaria: 1,
  Semanal: 2,
  Mensal: 3,
} as const

export type Recorrencia = (typeof Recorrencia)[keyof typeof Recorrencia]

export interface Rotina {
  id: number
  titulo: string
  descricao?: string | null
  recorrencia: Recorrencia
  horaInicio: string
  horaFim: string
  ativa: boolean
}

export interface RotinaRequest {
  titulo: string
  descricao?: string | null
  recorrencia: Recorrencia
  horaInicio: string
  horaFim: string
  ativa: boolean
}

export interface Evento {
  id: number
  titulo: string
  descricao?: string | null
  local?: string | null
  dataInicio: string
  dataFim: string
  rotinaId?: number | null
}

export interface EventoRequest {
  titulo: string
  descricao?: string | null
  local?: string | null
  dataInicio: string
  dataFim: string
  rotinaId?: number | null
}
export interface Usuario {
  id: number
  nome: string
  email: string
  fotoUrl?: string | null
}

export interface RegistroRequest {
  nome: string
  email: string
  senha: string
}

export interface LoginRequest {
  email: string
  senha: string
}

export interface AuthResponse {
  token: string
  usuario: Usuario
}
export interface Perfil {
  id: number
  nome: string
  email: string
  fotoUrl?: string | null
  criadoEm: string
  totalEventos: number
  totalRotinasAtivas: number
}

export interface AtualizarPerfilRequest {
  nome: string
  email: string
}

export interface TrocarSenhaRequest {
  senhaAtual: string
  novaSenha: string
}