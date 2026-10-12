# SmartAgenda

Aplicação full-stack de agenda inteligente para gerenciar eventos e rotinas, com autenticação de usuários, detecção automática de conflitos de horário e sugestão de janelas livres.

## Stack

**Backend**
- C# / ASP.NET Core Web API
- Entity Framework Core
- PostgreSQL
- JWT (autenticação) + BCrypt (hash de senha)

**Frontend**
- React + TypeScript
- Vite
- Tailwind CSS
- React Router

## Funcionalidades

- Cadastro e login de usuários (JWT), dados isolados por conta
- CRUD completo de Eventos e Rotinas
- Vínculo de eventos a rotinas recorrentes (diária, semanal, mensal)
- Detecção de conflito de horário ao criar/editar eventos
- Cálculo de horários livres no dia
- Dashboard com resumo do dia, ocupação, eventos da semana e estatísticas
- Calendário mensal navegável
- Perfil de usuário: editar dados, trocar senha, upload de foto
- Seletor de tema (escuro, claro, vermelho suave)

## Como rodar

### Pré-requisitos
- .NET SDK
- Node.js
- PostgreSQL

### Backend

```bash
cd backend/SmartAgenda.Api
dotnet restore
dotnet ef database update
dotnet run
```

API disponível em `http://localhost:5296` (Swagger em `/swagger`).

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Aplicação disponível em `http://localhost:5173`.

### Configuração do banco

Ajuste a connection string em `backend/SmartAgenda.Api/appsettings.json` (este arquivo não é versionado, por conter credenciais):

```json
"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Port=5432;Database=smartagenda;Username=postgres;Password=SUA_SENHA"
}
```

## Estrutura do projeto
SmartAgenda/
├── backend/
│ └── SmartAgenda.Api/
│ ├── Controllers/
│ ├── Data/
│ ├── Dtos/
│ ├── Models/
│ ├── Services/
│ └── wwwroot/uploads/ # fotos de perfil
└── frontend/
└── src/
├── components/
├── contexts/
├── hooks/
├── pages/
├── services/
└── types/


## Deploy

Deploy público planejado (Render para backend + PostgreSQL, Vercel para frontend) — ainda não realizado. Por ora, o projeto roda localmente com o PostgreSQL já configurado na máquina.