import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { DashboardPage } from './pages/DashboardPage'
import { EventosPage } from './pages/EventosPage'
import { RotinasPage } from './pages/RotinasPage'
import { CalendarioPage } from './pages/CalendarioPage'
import { LoginPage } from './pages/LoginPage'
import { CadastroPage } from './pages/CadastroPage'
import { PerfilPage } from './pages/PerfilPage'
import { SeletorTema } from './components/SeletorTema'
import { RequireAuth } from './components/RequireAuth'
import { useTema } from './hooks/UseTema'
import { AuthProvider, useAuth } from './contexts/AuthContext'

const BASE_URL = 'http://localhost:5296'

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  const location = useLocation()
  const ativo = location.pathname === to
  return (
    <Link
      to={to}
      className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        ativo ? 'bg-brand text-brand-ink' : 'text-muted hover:bg-surface-2 hover:text-ink'
      }`}
    >
      {children}
    </Link>
  )
}

function Layout({ children }: { children: React.ReactNode }) {
  const { tema, setTema } = useTema()
  const { usuario, sair } = useAuth()

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 shrink-0 bg-surface shadow-lg shadow-black/40 p-5 flex flex-col gap-1">
        <span className="font-display text-xl font-semibold text-brand mb-6 tracking-tight">
          SmartAgenda
        </span>
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/calendario">Calendário</NavLink>
        <NavLink to="/eventos">Eventos</NavLink>
        <NavLink to="/rotinas">Rotinas</NavLink>

        {usuario && (
          <Link to="/perfil" className="mt-6 flex items-center gap-2 px-1 hover:opacity-80">
            {usuario.fotoUrl ? (
              <img
                src={`${BASE_URL}${usuario.fotoUrl}`}
                alt={usuario.nome}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center text-sm text-ink">
                {usuario.nome.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-ink truncate">{usuario.nome}</p>
            </div>
          </Link>
        )}
        <button onClick={sair} className="text-left text-sm text-muted hover:text-danger px-1 mt-1">
          Sair
        </button>

        <SeletorTema tema={tema} setTema={setTema} />
      </aside>

      <main className="flex-1">{children}</main>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<CadastroPage />} />
          <Route
            path="/*"
            element={
              <RequireAuth>
                <Layout>
                  <Routes>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/calendario" element={<CalendarioPage />} />
                    <Route path="/eventos" element={<EventosPage />} />
                    <Route path="/rotinas" element={<RotinasPage />} />
                    <Route path="/perfil" element={<PerfilPage />} />
                  </Routes>
                </Layout>
              </RequireAuth>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App