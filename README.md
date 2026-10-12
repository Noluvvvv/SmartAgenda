# SmartAgenda

Aplicação full-stack de agenda inteligente para gerenciar eventos e rotinas, com detecção automática de conflitos de horário e sugestão de janelas livres.

## Stack

**Backend**
- C# / ASP.NET Core Web API
- Entity Framework Core
- PostgreSQL

**Frontend**
- React + TypeScript
- Vite
- Tailwind CSS
- React Router

## Funcionalidades

- CRUD completo de Eventos e Rotinas
- Vínculo de eventos a rotinas recorrentes (diária, semanal, mensal)
- Detecção de conflito de horário ao criar/editar eventos
- Cálculo de horários livres no dia
- Dashboard com resumo do dia
- Calendário mensal navegável

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

Ajuste a connection string em `backend/SmartAgenda.Api/appsettings.json`:

```json
"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Port=5432;Database=smartagenda;Username=postgres;Password=SUA_SENHA"
}
```

## Estrutura do projeto

SmartAgenda/
├── backend/
│   └── SmartAgenda.Api/
│       ├── Controllers/
│       ├── Data/
│       ├── Dtos/
│       ├── Models/
│       └── Services/
└── frontend/
    └── src/
        ├── components/
        ├── pages/
        ├── services/
        └── types/
```