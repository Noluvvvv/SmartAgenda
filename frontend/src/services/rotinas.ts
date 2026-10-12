import { api } from './api'
import type { Rotina, RotinaRequest } from '../types'

export const rotinasService = {
  listar: () => api.get<Rotina[]>('/Rotinas'),
  buscar: (id: number) => api.get<Rotina>(`/Rotinas/${id}`),
  criar: (dto: RotinaRequest) => api.post<Rotina>('/Rotinas', dto),
  atualizar: (id: number, dto: RotinaRequest) => api.put<void>(`/Rotinas/${id}`, dto),
  remover: (id: number) => api.delete<void>(`/Rotinas/${id}`),
}