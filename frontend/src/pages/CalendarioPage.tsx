import { useEffect, useMemo, useState } from 'react'
import { eventosService } from '../services/eventos'
import type { Evento } from '../types'

function chaveDia(d: Date) {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

export function CalendarioPage() {
  const [eventos, setEventos] = useState<Evento[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [referencia, setReferencia] = useState(new Date())
  const [diaSelecionado, setDiaSelecionado] = useState<Date | null>(null)

  useEffect(() => {
    eventosService
      .listar()
      .then(setEventos)
      .catch((e) => setErro(e.message))
      .finally(() => setCarregando(false))
  }, [])

  const eventosPorDia = useMemo(() => {
    const mapa = new Map<string, Evento[]>()
    for (const e of eventos) {
      const chave = chaveDia(new Date(e.dataInicio))
      if (!mapa.has(chave)) mapa.set(chave, [])
      mapa.get(chave)!.push(e)
    }
    return mapa
  }, [eventos])

  if (carregando) return <p className="p-4">Carregando calendário...</p>
  if (erro) return <p className="p-4 text-red-600">Erro: {erro}</p>

  const ano = referencia.getFullYear()
  const mes = referencia.getMonth()
  const primeiroDiaSemana = new Date(ano, mes, 1).getDay()
  const diasNoMes = new Date(ano, mes + 1, 0).getDate()
  const hoje = new Date()

  const celulas: (Date | null)[] = []
  for (let i = 0; i < primeiroDiaSemana; i++) celulas.push(null)
  for (let dia = 1; dia <= diasNoMes; dia++) celulas.push(new Date(ano, mes, dia))

  const nomeMes = referencia.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
  const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  const eventosDoDiaSelecionado = diaSelecionado
    ? eventosPorDia.get(chaveDia(diaSelecionado)) ?? []
    : []

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setReferencia(new Date(ano, mes - 1, 1))}
          className="px-2 py-1 border border-gray-300 rounded-md"
        >
          ←
        </button>
        <h1 className="text-xl font-bold capitalize">{nomeMes}</h1>
        <button
          onClick={() => setReferencia(new Date(ano, mes + 1, 1))}
          className="px-2 py-1 border border-gray-300 rounded-md"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {diasSemana.map((d) => (
          <div key={d} className="text-center text-xs text-gray-500 font-medium py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {celulas.map((dia, i) => {
          if (!dia) return <div key={i} />

          const chave = chaveDia(dia)
          const eventosDoDia = eventosPorDia.get(chave) ?? []
          const ehHoje = chaveDia(dia) === chaveDia(hoje)
          const selecionado = diaSelecionado && chaveDia(dia) === chaveDia(diaSelecionado)

          return (
            <button
              key={i}
              onClick={() => setDiaSelecionado(dia)}
              className={`aspect-square border rounded-md p-1 text-left text-sm flex flex-col gap-0.5
                ${ehHoje ? 'border-blue-500' : 'border-gray-200'}
                ${selecionado ? 'bg-blue-50' : ''}`}
            >
              <span className={ehHoje ? 'font-bold text-blue-600' : ''}>{dia.getDate()}</span>
              {eventosDoDia.length > 0 && (
                <span className="text-[10px] bg-blue-600 text-white rounded px-1 self-start">
                  {eventosDoDia.length}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {diaSelecionado && (
        <div className="mt-6">
          <h2 className="font-semibold mb-2">
            {diaSelecionado.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
          </h2>
          {eventosDoDiaSelecionado.length === 0 && (
            <p className="text-gray-500 text-sm">Nenhum evento nesse dia.</p>
          )}
          <ul className="space-y-2">
            {eventosDoDiaSelecionado.map((e) => (
              <li key={e.id} className="border border-gray-200 rounded-lg p-3">
                <p className="font-medium">{e.titulo}</p>
                <p className="text-sm text-gray-500">
                  {new Date(e.dataInicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  {' – '}
                  {new Date(e.dataFim).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  {e.local && ` · ${e.local}`}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}