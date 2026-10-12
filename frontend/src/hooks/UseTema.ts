import { useEffect, useState } from 'react'

export const TEMAS = ['escuro', 'claro', 'vermelho'] as const
export type Tema = (typeof TEMAS)[number]

const labelTema: Record<Tema, string> = {
  escuro: 'Escuro',
  claro: 'Claro',
  vermelho: 'Vermelho suave',
}

export { labelTema }

function temaSalvo(): Tema {
  const salvo = localStorage.getItem('smartagenda-tema')
  return (TEMAS as readonly string[]).includes(salvo ?? '') ? (salvo as Tema) : 'escuro'
}

export function useTema() {
  const [tema, setTema] = useState<Tema>(temaSalvo)

  useEffect(() => {
    document.documentElement.setAttribute('data-tema', tema)
    localStorage.setItem('smartagenda-tema', tema)
  }, [tema])

  return { tema, setTema }
}