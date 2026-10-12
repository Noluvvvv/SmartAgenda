import { api } from './api'
import type { Evento, EventoRequest } from '../types'

export interface SlotLivre {
  inicio: string
  fim: string
}

export const eventosService = {
  listar: () => api.get<Evento[]>('/Eventos'),
  buscar: (id: number) => api.get<Evento>(`/Eventos/${id}`),
  criar: (dto: EventoRequest) => api.post<Evento>('/Eventos', dto),
  atualizar: (id: number, dto: EventoRequest) => api.put<void>(`/Eventos/${id}`, dto),
  remover: (id: number) => api.delete<void>(`/Eventos/${id}`),
  horariosLivres: (data: string) =>
    api.get<SlotLivre[]>(`/Eventos/horarios-livres?data=${data}`),
}