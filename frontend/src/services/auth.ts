import { api } from './api'
import type { AuthResponse, LoginRequest, RegistroRequest } from '../types'

export const authService = {
  registro: (dto: RegistroRequest) => api.post<AuthResponse>('/Auth/registro', dto),
  login: (dto: LoginRequest) => api.post<AuthResponse>('/Auth/login', dto),
}