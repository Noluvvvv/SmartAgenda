import { useEffect, useState } from 'react'
import { eventosService } from '../services/eventos'
import { rotinasService } from '../services/rotinas'
import { HorariosLivres } from '../components/HorariosLivres'
import { Recorrencia, type Evento, type Rotina } from '../types'

function mesmoDia(data: Date, outra: Date) {
  return (
    data.getFullYear() === outra.getFullYear() &&
    data.getMonth() === outra.getMonth() &&
    data.getDate() === outra.getDate()
  )
}

function inicioDoDia(d: Date) {
  const r = new Date(d)
  r.setHours(0, 0, 0, 0)
  return r
}

const labelRecorrencia: Record<Recorrencia, string> = {
  [Recorrencia.Diaria]: 'Diária',
  [Recorrencia.Semanal]: 'Semanal',
  [Recorrencia.Mensal]: 'Mensal',
}

export function DashboardPage() {
  const [eventos, setEventos] = useState<Evento[]>([])
  const [rotinas, setRotinas] = useState<Rotina[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([eventosService.listar(), rotinasService.listar()])
      .then(([e, r]) => {
        setEventos(e)
        setRotinas(r)
      })
      .catch((e) => setErro(e.message))
      .finally(() => setCarregando(false))
  }, [])

  if (carregando) return <p className="p-6 text-muted">Carregando...</p>
  if (erro) return <p className="p-6 text-danger">Erro: {erro}</p>

  const hoje = new Date()
  const hojeInicio = inicioDoDia(hoje)

  const eventosHoje = eventos
    .filter((e) => mesmoDia(new Date(e.dataInicio), hoje))
    .sort((a, b) => a.dataInicio.localeCompare(b.dataInicio))

  const rotinasAtivas = rotinas.filter((r) => r.ativa)

  const eventosPorRotina = rotinas
    .map((r) => ({
      rotina: r.titulo,
      total: eventos.filter((e) => e.rotinaId === r.id).length,
    }))
    .filter((x) => x.total > 0)
    .sort((a, b) => b.total - a.total)
  const maxEventosPorRotina = Math.max(1, ...eventosPorRotina.map((x) => x.total))

  // 2. Eventos da semana (próximos 7 dias, incluindo hoje)
  const seteDiasDepois = new Date(hojeInicio)
  seteDiasDepois.setDate(seteDiasDepois.getDate() + 7)
  const eventosSemana = eventos
    .filter((e) => {
      const d = new Date(e.dataInicio)
      return d >= hojeInicio && d < seteDiasDepois
    })
    .sort((a, b) => a.dataInicio.localeCompare(b.dataInicio))

  const janelaInicio = new Date(hojeInicio)
  janelaInicio.setHours(8, 0, 0, 0)
  const janelaFim = new Date(hojeInicio)
  janelaFim.setHours(22, 0, 0, 0)
  const minutosJanela = (janelaFim.getTime() - janelaInicio.getTime()) / 60000

  const minutosOcupados = eventosHoje.reduce((total, e) => {
    const inicio = Math.max(new Date(e.dataInicio).getTime(), janelaInicio.getTime())
    const fim = Math.min(new Date(e.dataFim).getTime(), janelaFim.getTime())
    return total + Math.max(0, (fim - inicio) / 60000)
  }, 0)
  const percentualOcupacao = Math.min(100, Math.round((minutosOcupados / minutosJanela) * 100))

  const contagemRecorrencia = [Recorrencia.Diaria, Recorrencia.Semanal, Recorrencia.Mensal].map((r) => ({
    recorrencia: r,
    total: rotinas.filter((rt) => rt.recorrencia === r).length,
  }))
  const maxRecorrencia = Math.max(1, ...contagemRecorrencia.map((x) => x.total))

  const ultimosEventos = [...eventos].sort((a, b) => b.id - a.id).slice(0, 5)

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-display font-semibold text-ink">
        Hoje — {hoje.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
      </h1>

      <div className="grid grid-cols-2 gap-4">
        <div className="border border-line bg-surface rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-ink">{eventosHoje.length}</p>
          <p className="text-sm text-muted">Eventos hoje</p>
        </div>
        <div className="border border-line bg-surface rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-ink">{rotinasAtivas.length}</p>
          <p className="text-sm text-muted">Rotinas ativas</p>
        </div>
      </div>

      <HorariosLivres />

      <div className="border border-line bg-surface rounded-lg p-4">
        <div className="flex justify-between items-baseline mb-2">
          <h3 className="font-semibold text-sm text-ink">Ocupação do dia</h3>
          <span className="text-sm text-muted">{percentualOcupacao}%</span>
        </div>
        <div className="h-2 rounded-full bg-surface-2 overflow-hidden">
          <div
            className="h-full rounded-full bg-brand"
            style={{ width: `${percentualOcupacao}%` }}
          />
        </div>
        <p className="text-xs text-muted mt-2">Janela considerada: 08:00 – 22:00</p>
      </div>

      <div>
        <h2 className="font-semibold mb-2 text-ink">Eventos de hoje</h2>
        {eventosHoje.length === 0 && <p className="text-muted text-sm">Nenhum evento para hoje.</p>}
        <ul className="space-y-2">
          {eventosHoje.map((e) => (
            <li key={e.id} className="border border-line bg-surface rounded-lg p-3">
              <p className="font-medium text-ink">{e.titulo}</p>
              <p className="text-sm text-muted">
                {new Date(e.dataInicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                {' – '}
                {new Date(e.dataFim).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                {e.local && ` · ${e.local}`}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="font-semibold mb-2 text-ink">Próximos 7 dias</h2>
        {eventosSemana.length === 0 && <p className="text-muted text-sm">Nenhum evento nos próximos dias.</p>}
        <ul className="space-y-2">
          {eventosSemana.map((e) => (
            <li key={e.id} className="border border-line bg-surface rounded-lg p-3 flex justify-between items-center">
              <div>
                <p className="font-medium text-ink">{e.titulo}</p>
                <p className="text-sm text-muted">
                  {new Date(e.dataInicio).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' })}
                  {' · '}
                  {new Date(e.dataInicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="font-semibold mb-2 text-ink">Rotinas ativas</h2>
        {rotinasAtivas.length === 0 && <p className="text-muted text-sm">Nenhuma rotina ativa.</p>}
        <ul className="space-y-2">
          {rotinasAtivas.map((r) => (
            <li key={r.id} className="border border-line bg-surface rounded-lg p-3">
              <p className="font-medium text-ink">{r.titulo}</p>
              <p className="text-sm text-muted">{r.horaInicio} – {r.horaFim}</p>
            </li>
          ))}
        </ul>
      </div>

      
      <div className="border border-line bg-surface rounded-lg p-4">
        <h3 className="font-semibold text-sm mb-3 text-ink">Rotinas por recorrência</h3>
        <div className="space-y-2">
          {contagemRecorrencia.map(({ recorrencia, total }) => (
            <div key={recorrencia} className="flex items-center gap-3">
              <span className="text-xs text-muted w-16">{labelRecorrencia[recorrencia]}</span>
              <div className="flex-1 h-2 rounded-full bg-surface-2 overflow-hidden">
                <div
                  className="h-full rounded-full bg-ok"
                  style={{ width: `${(total / maxRecorrencia) * 100}%` }}
                />
              </div>
              <span className="text-xs text-muted w-4 text-right">{total}</span>
            </div>
          ))}
        </div>
      </div>

   
      {eventosPorRotina.length > 0 && (
        <div className="border border-line bg-surface rounded-lg p-4">
          <h3 className="font-semibold text-sm mb-3 text-ink">Eventos por rotina</h3>
          <div className="space-y-2">
            {eventosPorRotina.map(({ rotina, total }) => (
              <div key={rotina} className="flex items-center gap-3">
                <span className="text-xs text-muted w-24 truncate">{rotina}</span>
                <div className="flex-1 h-2 rounded-full bg-surface-2 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-brand"
                    style={{ width: `${(total / maxEventosPorRotina) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-muted w-4 text-right">{total}</span>
              </div>
            ))}
          </div>
        </div>
      )}

     
      <div className="border border-line bg-surface rounded-lg p-4">
        <h3 className="font-semibold text-sm mb-3 text-ink">Últimos eventos criados</h3>
        {ultimosEventos.length === 0 && <p className="text-muted text-sm">Nenhum evento ainda.</p>}
        <ul className="space-y-2">
          {ultimosEventos.map((e) => (
            <li key={e.id} className="flex justify-between text-sm">
              <span className="text-ink">{e.titulo}</span>
              <span className="text-muted">{new Date(e.dataInicio).toLocaleDateString('pt-BR')}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}