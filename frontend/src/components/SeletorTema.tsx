import { TEMAS, labelTema, type Tema } from '../hooks/UseTema'

interface Props {
  tema: Tema
  setTema: (t: Tema) => void
}

export function SeletorTema({ tema, setTema }: Props) {
  return (
    <div className="mt-auto pt-4 border-t border-line">
      <p className="text-xs text-muted mb-2 px-1">Tema</p>
      <div className="flex flex-col gap-1">
        {TEMAS.map((t) => (
          <button
            key={t}
            onClick={() => setTema(t)}
            className={`text-left px-3 py-1.5 rounded-md text-sm transition-colors ${
              tema === t ? 'bg-brand text-brand-ink' : 'text-muted hover:bg-surface-2 hover:text-ink'
            }`}
          >
            {labelTema[t]}
          </button>
        ))}
      </div>
    </div>
  )
}