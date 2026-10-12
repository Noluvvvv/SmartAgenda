import { useEffect, useState } from 'react'
import { eventosService } from '../services/eventos'
import { rotinasService } from '../services/rotinas'
import type { Evento, Rotina } from '../types'

export function EventosPage() {
  const [eventos, setEventos] = useState<Evento[]>([])
  const [rotinas, setRotinas] = useState<Rotina[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [mostrarForm, setMostrarForm] = useState(false)

  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [local, setLocal] = useState('')
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')
  const [rotinaId, setRotinaId] = useState<string>('')
  const [enviando, setEnviando] = useState(false)
  const [erroForm, setErroForm] = useState<string | null>(null)

  const [editandoId, setEditandoId] = useState<number | null>(null)
  const [tituloEdicao, setTituloEdicao] = useState('')
  const [dataInicioEdicao, setDataInicioEdicao] = useState('')
  const [dataFimEdicao, setDataFimEdicao] = useState('')
  const [rotinaIdEdicao, setRotinaIdEdicao] = useState<string>('')

  function carregar() {
    setCarregando(true)
    Promise.all([eventosService.listar(), rotinasService.listar()])
      .then(([e, r]) => {
        setEventos(e)
        setRotinas(r)
      })
      .catch((e) => setErro(e.message))
      .finally(() => setCarregando(false))
  }

  useEffect(() => {
    carregar()
  }, [])

  function nomeRotina(id?: number | null) {
    if (!id) return null
    return rotinas.find((r) => r.id === id)?.titulo ?? null
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErroForm(null)
    setEnviando(true)

    try {
      await eventosService.criar({
        titulo,
        descricao: descricao || null,
        local: local || null,
        dataInicio: new Date(dataInicio).toISOString(),
        dataFim: new Date(dataFim).toISOString(),
        rotinaId: rotinaId ? Number(rotinaId) : null,
      })
      setTitulo('')
      setDescricao('')
      setLocal('')
      setDataInicio('')
      setDataFim('')
      setRotinaId('')
      setMostrarForm(false)
      carregar()
    } catch (e) {
      setErroForm((e as Error).message)
    } finally {
      setEnviando(false)
    }
  }

  function iniciarEdicao(evento: Evento) {
    setEditandoId(evento.id)
    setTituloEdicao(evento.titulo)
    setDataInicioEdicao(evento.dataInicio.slice(0, 16))
    setDataFimEdicao(evento.dataFim.slice(0, 16))
    setRotinaIdEdicao(evento.rotinaId ? String(evento.rotinaId) : '')
  }

  async function handleSalvarEdicao(e: React.FormEvent, id: number) {
    e.preventDefault()
    const evento = eventos.find((ev) => ev.id === id)
    if (!evento) return

    try {
      await eventosService.atualizar(id, {
        titulo: tituloEdicao,
        descricao: evento.descricao,
        local: evento.local,
        dataInicio: new Date(dataInicioEdicao).toISOString(),
        dataFim: new Date(dataFimEdicao).toISOString(),
        rotinaId: rotinaIdEdicao ? Number(rotinaIdEdicao) : null,
      })
      setEditandoId(null)
      carregar()
    } catch (e) {
      alert((e as Error).message)
    }
  }

  async function handleExcluir(id: number) {
    if (!confirm('Excluir este evento?')) return
    await eventosService.remover(id)
    carregar()
  }

  if (carregando) return <p className="p-4">Carregando eventos...</p>
  if (erro) return <p className="p-4 text-red-600">Erro: {erro}</p>

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Eventos</h1>
        <button
          onClick={() => setMostrarForm((v) => !v)}
          className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm"
        >
          {mostrarForm ? 'Cancelar' : '+ Novo evento'}
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
            <label className="block text-sm font-medium mb-1">Local</label>
            <input
              value={local}
              onChange={(e) => setLocal(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Início</label>
              <input
                required
                type="datetime-local"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Fim</label>
              <input
                required
                type="datetime-local"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Rotina (opcional)</label>
            <select
              value={rotinaId}
              onChange={(e) => setRotinaId(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Nenhuma</option>
              {rotinas.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.titulo}
                </option>
              ))}
            </select>
          </div>

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

      {eventos.length === 0 && (
        <p className="text-gray-500">Nenhum evento cadastrado ainda.</p>
      )}

      <ul className="space-y-3">
        {eventos.map((evento) =>
          editandoId === evento.id ? (
            <li key={evento.id} className="border border-gray-200 rounded-lg p-4">
              <form onSubmit={(e) => handleSalvarEdicao(e, evento.id)} className="space-y-3">
                <input
                  required
                  value={tituloEdicao}
                  onChange={(e) => setTituloEdicao(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
                <div className="flex gap-3">
                  <input
                    required
                    type="datetime-local"
                    value={dataInicioEdicao}
                    onChange={(e) => setDataInicioEdicao(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                  />
                  <input
                    required
                    type="datetime-local"
                    value={dataFimEdicao}
                    onChange={(e) => setDataFimEdicao(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <select
                  value={rotinaIdEdicao}
                  onChange={(e) => setRotinaIdEdicao(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Nenhuma rotina</option>
                  {rotinas.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.titulo}
                    </option>
                  ))}
                </select>
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
            <li key={evento.id} className="border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-semibold">{evento.titulo}</h2>
                  {evento.local && <p className="text-sm text-gray-500">{evento.local}</p>}
                  <p className="text-sm text-gray-600">
                    {new Date(evento.dataInicio).toLocaleString('pt-BR')} —{' '}
                    {new Date(evento.dataFim).toLocaleString('pt-BR')}
                  </p>
                  {nomeRotina(evento.rotinaId) && (
                    <span className="inline-block mt-1 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                      {nomeRotina(evento.rotinaId)}
                    </span>
                  )}
                </div>
                <div className="flex gap-2 text-sm">
                  <button onClick={() => iniciarEdicao(evento)} className="text-blue-600">
                    Editar
                  </button>
                  <button onClick={() => handleExcluir(evento.id)} className="text-red-600">
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