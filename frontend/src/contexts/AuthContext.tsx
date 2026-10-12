import { createContext, useContext, useEffect, useState } from 'react'
import { authService } from '../services/auth'
import type { LoginRequest, RegistroRequest, Usuario } from '../types'

interface AuthContextValue {
  usuario: Usuario | null
  carregando: boolean
  login: (dto: LoginRequest) => Promise<void>
  registrar: (dto: RegistroRequest) => Promise<void>
  sair: () => void
  atualizarUsuario: (dados: Partial<Usuario>) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('smartagenda-usuario')
    if (usuarioSalvo) {
      setUsuario(JSON.parse(usuarioSalvo))
    }
    setCarregando(false)
  }, [])

  async function login(dto: LoginRequest) {
    const resposta = await authService.login(dto)
    localStorage.setItem('smartagenda-token', resposta.token)
    localStorage.setItem('smartagenda-usuario', JSON.stringify(resposta.usuario))
    setUsuario(resposta.usuario)
  }

  async function registrar(dto: RegistroRequest) {
    const resposta = await authService.registro(dto)
    localStorage.setItem('smartagenda-token', resposta.token)
    localStorage.setItem('smartagenda-usuario', JSON.stringify(resposta.usuario))
    setUsuario(resposta.usuario)
  }

  function sair() {
    localStorage.removeItem('smartagenda-token')
    localStorage.removeItem('smartagenda-usuario')
    setUsuario(null)
  }

  function atualizarUsuario(dados: Partial<Usuario>) {
    setUsuario((atual) => {
      if (!atual) return atual
      const atualizado = { ...atual, ...dados }
      localStorage.setItem('smartagenda-usuario', JSON.stringify(atualizado))
      return atualizado
    })
  }

  return (
    <AuthContext.Provider value={{ usuario, carregando, login, registrar, sair, atualizarUsuario }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth precisa estar dentro de AuthProvider')
  return ctx
}