import { useEffect, useState } from 'react'
import { eventosService, type SlotLivre } from '../services/eventos'

function formatarHora(iso: string) {
  return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

export function HorariosLivres() {
  const [slots, setSlots] = useState<SlotLivre[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    const hoje = new Date().toISOString().slice(0, 10)
    eventosService
      .horariosLivres(hoje)
      .then(setSlots)
      .catch((e) => setErro(e.message))
      .finally(() => setCarregando(false))
  }, [])

  if (carregando) return null
  if (erro) return null

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <h3 className="font-semibold mb-2 text-sm text-gray-700">Horários livres hoje</h3>
      {slots.length === 0 && (
        <p className="text-sm text-gray-500">Sem janelas livres hoje.</p>
      )}
      <ul className="space-y-1">
        {slots.map((s, i) => (
          <li key={i} className="text-sm bg-green-50 text-green-700 rounded-md px-2 py-1 inline-block mr-2">
            {formatarHora(s.inicio)} – {formatarHora(s.fim)}
          </li>
        ))}
      </ul>
    </div>
  )
}