import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro(null)
    setEnviando(true)
    try {
      await login({ email, senha })
      navigate('/')
    } catch (e) {
      setErro((e as Error).message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-surface border border-line rounded-lg p-6">
        <h1 className="font-display text-xl font-semibold text-ink mb-6 text-center">
          SmartAgenda
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-ink">E-mail</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-line bg-surface-2 text-ink rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-ink">Senha</label>
            <input
              required
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full border border-line bg-surface-2 text-ink rounded-md px-3 py-2"
            />
          </div>

          {erro && <p className="text-danger text-sm">{erro}</p>}

          <button
            type="submit"
            disabled={enviando}
            className="w-full bg-brand text-brand-ink px-4 py-2 rounded-md disabled:opacity-50"
          >
            {enviando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="text-sm text-muted text-center mt-4">
          Não tem conta?{' '}
          <Link to="/cadastro" className="text-ink underline">
            Criar uma conta
          </Link>
        </p>
      </div>
    </div>
  )
}