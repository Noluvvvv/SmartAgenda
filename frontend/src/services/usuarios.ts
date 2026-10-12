import { api } from './api'
import type { AtualizarPerfilRequest, Perfil, TrocarSenhaRequest } from '../types'

export const usuariosService = {
  buscarPerfil: () => api.get<Perfil>('/Usuarios/perfil'),
  atualizarPerfil: (dto: AtualizarPerfilRequest) => api.put<void>('/Usuarios/perfil', dto),
  trocarSenha: (dto: TrocarSenhaRequest) => api.put<void>('/Usuarios/senha', dto),
  uploadFoto: (arquivo: File) => {
    const formData = new FormData()
    formData.append('arquivo', arquivo)
    return api.upload<{ fotoUrl: string }>('/Usuarios/foto', formData)
  },
}