import { useEffect, useRef, useState } from 'react'
import { usuariosService } from '../services/usuarios'
import { useAuth } from '../contexts/AuthContext'
import type { Perfil } from '../types'

const BASE_URL = 'http://localhost:5296'

export function PerfilPage() {
  const { atualizarUsuario } = useAuth()
  const [perfil, setPerfil] = useState<Perfil | null>(null)
  const [carregando, setCarregando] = useState(true)

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [salvandoPerfil, setSalvandoPerfil] = useState(false)
  const [erroPerfil, setErroPerfil] = useState<string | null>(null)
  const [sucessoPerfil, setSucessoPerfil] = useState(false)

  const [senhaAtual, setSenhaAtual] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [salvandoSenha, setSalvandoSenha] = useState(false)
  const [erroSenha, setErroSenha] = useState<string | null>(null)
  const [sucessoSenha, setSucessoSenha] = useState(false)

  const [enviandoFoto, setEnviandoFoto] = useState(false)
  const [erroFoto, setErroFoto] = useState<string | null>(null)
  const inputFotoRef = useRef<HTMLInputElement>(null)

  function carregar() {
    setCarregando(true)
    usuariosService
      .buscarPerfil()
      .then((p) => {
        setPerfil(p)
        setNome(p.nome)
        setEmail(p.email)
      })
      .finally(() => setCarregando(false))
  }

  useEffect(() => {
    carregar()
  }, [])

  async function handleSalvarPerfil(e: React.FormEvent) {
    e.preventDefault()
    setErroPerfil(null)
    setSucessoPerfil(false)
    setSalvandoPerfil(true)
    try {
      await usuariosService.atualizarPerfil({ nome, email })
      atualizarUsuario({ nome, email })
      setSucessoPerfil(true)
      carregar()
    } catch (e) {
      setErroPerfil((e as Error).message)
    } finally {
      setSalvandoPerfil(false)
    }
  }

  async function handleTrocarSenha(e: React.FormEvent) {
    e.preventDefault()
    setErroSenha(null)
    setSucessoSenha(false)
    setSalvandoSenha(true)
    try {
      await usuariosService.trocarSenha({ senhaAtual, novaSenha })
      setSenhaAtual('')
      setNovaSenha('')
      setSucessoSenha(true)
    } catch (e) {
      setErroSenha((e as Error).message)
    } finally {
      setSalvandoSenha(false)
    }
  }

  async function handleSelecionarFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0]
    if (!arquivo) return

    setErroFoto(null)
    setEnviandoFoto(true)
    try {
      const { fotoUrl } = await usuariosService.uploadFoto(arquivo)
      atualizarUsuario({ fotoUrl })
      carregar()
    } catch (e) {
      setErroFoto((e as Error).message)
    } finally {
      setEnviandoFoto(false)
      if (inputFotoRef.current) inputFotoRef.current.value = ''
    }
  }

  if (carregando || !perfil) return <p className="p-6 text-muted">Carregando...</p>

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-display font-semibold text-ink">Meu perfil</h1>

      <div className="border border-line bg-surface rounded-lg p-4 flex items-center gap-4">
        <div className="relative">
          {perfil.fotoUrl ? (
            <img
              src={`${BASE_URL}${perfil.fotoUrl}`}
              alt={perfil.nome}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-surface-2 flex items-center justify-center text-xl text-ink">
              {perfil.nome.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-1">
          <p className="font-medium text-ink">{perfil.nome}</p>
          <p className="text-sm text-muted">{perfil.email}</p>
          <button
            onClick={() => inputFotoRef.current?.click()}
            disabled={enviandoFoto}
            className="text-sm text-ink underline mt-1 disabled:opacity-50"
          >
            {enviandoFoto ? 'Enviando...' : 'Trocar foto'}
          </button>
          <input
            ref={inputFotoRef}
            type="file"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleSelecionarFoto}
            className="hidden"
          />
          {erroFoto && <p className="text-danger text-sm mt-1">{erroFoto}</p>}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="border border-line bg-surface rounded-lg p-4 text-center">
          <p className="text-xl font-bold text-ink">{perfil.totalEventos}</p>
          <p className="text-xs text-muted">Eventos criados</p>
        </div>
        <div className="border border-line bg-surface rounded-lg p-4 text-center">
          <p className="text-xl font-bold text-ink">{perfil.totalRotinasAtivas}</p>
          <p className="text-xs text-muted">Rotinas ativas</p>
        </div>
        <div className="border border-line bg-surface rounded-lg p-4 text-center">
          <p className="text-sm font-bold text-ink">
            {new Date(perfil.criadoEm).toLocaleDateString('pt-BR')}
          </p>
          <p className="text-xs text-muted">Usando desde</p>
        </div>
      </div>

      <form onSubmit={handleSalvarPerfil} className="border border-line bg-surface rounded-lg p-4 space-y-3">
        <h2 className="font-semibold text-ink">Dados da conta</h2>
        <div>
          <label className="block text-sm font-medium mb-1 text-ink">Nome</label>
          <input
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full border border-line bg-surface-2 text-ink rounded-md px-3 py-2"
          />
        </div>
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
        {erroPerfil && <p className="text-danger text-sm">{erroPerfil}</p>}
        {sucessoPerfil && <p className="text-ok text-sm">Dados atualizados.</p>}
        <button
          type="submit"
          disabled={salvandoPerfil}
          className="bg-brand text-brand-ink px-4 py-2 rounded-md text-sm disabled:opacity-50"
        >
          {salvandoPerfil ? 'Salvando...' : 'Salvar'}
        </button>
      </form>

      <form onSubmit={handleTrocarSenha} className="border border-line bg-surface rounded-lg p-4 space-y-3">
        <h2 className="font-semibold text-ink">Trocar senha</h2>
        <div>
          <label className="block text-sm font-medium mb-1 text-ink">Senha atual</label>
          <input
            required
            type="password"
            value={senhaAtual}
            onChange={(e) => setSenhaAtual(e.target.value)}
            className="w-full border border-line bg-surface-2 text-ink rounded-md px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-ink">Nova senha</label>
          <input
            required
            type="password"
            minLength={6}
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            className="w-full border border-line bg-surface-2 text-ink rounded-md px-3 py-2"
          />
        </div>
        {erroSenha && <p className="text-danger text-sm">{erroSenha}</p>}
        {sucessoSenha && <p className="text-ok text-sm">Senha alterada.</p>}
        <button
          type="submit"
          disabled={salvandoSenha}
          className="bg-brand text-brand-ink px-4 py-2 rounded-md text-sm disabled:opacity-50"
        >
          {salvandoSenha ? 'Salvando...' : 'Trocar senha'}
        </button>
      </form>
    </div>
  )
}