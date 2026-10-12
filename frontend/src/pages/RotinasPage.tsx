import { useEffect, useState } from 'react'
import { rotinasService } from '../services/rotinas'
import { Recorrencia, type Rotina } from '../types'

const labelRecorrencia: Record<Recorrencia, string> = {
  [Recorrencia.Diaria]: 'Diária',
  [Recorrencia.Semanal]: 'Semanal',
  [Recorrencia.Mensal]: 'Mensal',
}

export function RotinasPage() {
  const [rotinas, setRotinas] = useState<Rotina[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [mostrarForm, setMostrarForm] = useState(false)

  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [recorrencia, setRecorrencia] = useState<Recorrencia>(Recorrencia.Semanal)
  const [horaInicio, setHoraInicio] = useState('')
  const [horaFim, setHoraFim] = useState('')
  const [ativa, setAtiva] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [erroForm, setErroForm] = useState<string | null>(null)

  const [editandoId, setEditandoId] = useState<number | null>(null)
  const [tituloEdicao, setTituloEdicao] = useState('')
  const [horaInicioEdicao, setHoraInicioEdicao] = useState('')
  const [horaFimEdicao, setHoraFimEdicao] = useState('')
  const [recorrenciaEdicao, setRecorrenciaEdicao] = useState<Recorrencia>(Recorrencia.Semanal)
  const [ativaEdicao, setAtivaEdicao] = useState(true)

  function carregar() {
    setCarregando(true)
    rotinasService
      .listar()
      .then(setRotinas)
      .catch((e) => setErro(e.message))
      .finally(() => setCarregando(false))
  }

  useEffect(() => {
    carregar()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErroForm(null)
    setEnviando(true)

    try {
      await rotinasService.criar({ titulo, descricao: descricao || null, recorrencia, horaInicio, horaFim, ativa })
      setTitulo('')
      setDescricao('')
      setHoraInicio('')
      setHoraFim('')
      setAtiva(true)
      setMostrarForm(false)
      carregar()
    } catch (e) {
      setErroForm((e as Error).message)
    } finally {
      setEnviando(false)
    }
  }

  function iniciarEdicao(rotina: Rotina) {
    setEditandoId(rotina.id)
    setTituloEdicao(rotina.titulo)
    setHoraInicioEdicao(rotina.horaInicio)
    setHoraFimEdicao(rotina.horaFim)
    setRecorrenciaEdicao(rotina.recorrencia)
    setAtivaEdicao(rotina.ativa)
  }

  async function handleSalvarEdicao(e: React.FormEvent, id: number) {
    e.preventDefault()
    const rotina = rotinas.find((r) => r.id === id)
    if (!rotina) return

    await rotinasService.atualizar(id, {
      titulo: tituloEdicao,
      descricao: rotina.descricao,
      recorrencia: recorrenciaEdicao,
      horaInicio: horaInicioEdicao,
      horaFim: horaFimEdicao,
      ativa: ativaEdicao,
    })
    setEditandoId(null)
    carregar()
  }

  async function handleExcluir(id: number) {
    if (!confirm('Excluir esta rotina?')) return
    await rotinasService.remover(id)
    carregar()
  }

  if (carregando) return <p className="p-4">Carregando rotinas...</p>
  if (erro) return <p className="p-4 text-red-600">Erro: {erro}</p>

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Rotinas</h1>
        <button
          onClick={() => setMostrarForm((v) => !v)}
          className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm"
        >
          {mostrarForm ? 'Cancelar' : '+ Nova rotina'}
        </button>
      </div>

      {mostrarForm && (
        <form onSubmit={handleSubmit} className="space-y-3 border border-gray-200 rounded-lg p-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Título</label>
            <input
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Descrição</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Recorrência</label>
            <select
              value={recorrencia}
              onChange={(e) => setRecorrencia(Number(e.target.value) as Recorrencia)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value={Recorrencia.Diaria}>Diária</option>
              <option value={Recorrencia.Semanal}>Semanal</option>
              <option value={Recorrencia.Mensal}>Mensal</option>
            </select>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Hora início</label>
              <input
                required
                type="time"
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Hora fim</label>
              <input
                required
                type="time"
                value={horaFim}
                onChange={(e) => setHoraFim(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={ativa} onChange={(e) => setAtiva(e.target.checked)} />
            Ativa
          </label>

          {erroForm && <p className="text-red-600 text-sm">{erroForm}</p>}

          <button
            type="submit"
            disabled={enviando}
            className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            {enviando ? 'Salvando...' : 'Salvar'}
          </button>
        </form>
      )}

      {rotinas.length === 0 && <p className="text-gray-500">Nenhuma rotina cadastrada ainda.</p>}

      <ul className="space-y-3">
        {rotinas.map((rotina) =>
          editandoId === rotina.id ? (
            <li key={rotina.id} className="border border-gray-200 rounded-lg p-4">
              <form onSubmit={(e) => handleSalvarEdicao(e, rotina.id)} className="space-y-3">
                <input
                  required
                  value={tituloEdicao}
                  onChange={(e) => setTituloEdicao(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
                <select
                  value={recorrenciaEdicao}
                  onChange={(e) => setRecorrenciaEdicao(Number(e.target.value) as Recorrencia)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value={Recorrencia.Diaria}>Diária</option>
                  <option value={Recorrencia.Semanal}>Semanal</option>
                  <option value={Recorrencia.Mensal}>Mensal</option>
                </select>
                <div className="flex gap-3">
                  <input
                    required
                    type="time"
                    value={horaInicioEdicao}
                    onChange={(e) => setHoraInicioEdicao(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                  />
                  <input
                    required
                    type="time"
                    value={horaFimEdicao}
                    onChange={(e) => setHoraFimEdicao(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={ativaEdicao}
                    onChange={(e) => setAtivaEdicao(e.target.checked)}
                  />
                  Ativa
                </label>
                <div className="flex gap-2">
                  <button type="submit" className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm">
                    Salvar
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditandoId(null)}
                    className="border border-gray-300 px-3 py-1.5 rounded-md text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </li>
          ) : (
            <li key={rotina.id} className="border border-gray-200 rounded-lg p-4 shadow-sm flex justify-between items-center">
              <div>
                <h2 className="font-semibold">{rotina.titulo}</h2>
                <p className="text-sm text-gray-500">
                  {labelRecorrencia[rotina.recorrencia]} · {rotina.horaInicio} – {rotina.horaFim}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-1 rounded-full ${rotina.ativa ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {rotina.ativa ? 'Ativa' : 'Inativa'}
                </span>
                <div className="flex gap-2 text-sm">
                  <button onClick={() => iniciarEdicao(rotina)} className="text-blue-600">
                    Editar
                  </button>
                  <button onClick={() => handleExcluir(rotina.id)} className="text-red-600">
                    Excluir
                  </button>
                </div>
              </div>
            </li>
          )
        )}
      </ul>
    </div>
  )
}