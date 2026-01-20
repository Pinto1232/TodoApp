# Todo App - Clean Architecture Monolith

A full-stack Todo application built with **Next.js** (Frontend) and **Node.js/Express** (Backend), following **Clean Architecture** principles and **SOLID** design patterns in a unified core structure.

## 🏗️ Architecture Overview

This project follows Clean Architecture with a **unified core** approach, where all layers are organized under a single `core/` directory:

```
TodoApp/
├── .gitignore
├── README.md
└── core/                              # Unified application core
    ├── package.json                   # Backend dependencies & scripts
    ├── tsconfig.json                  # TypeScript configuration
    ├── jest.config.js                 # Jest test configuration
    ├── .env                           # Environment variables (create from .env.example)
    ├── .env.example                   # Environment template
    └── src/
        ├── app.ts                     # Express application setup
        ├── index.ts                   # Server entry point
        │
        ├── todo.domain/               # 🎯 Enterprise Business Rules
        │   ├── entities/              # Business entities (Todo, Weather)
        │   └── repositories/          # Repository interfaces (contracts)
        │
        ├── todo.application/          # 🔧 Application Business Rules
        │   └── use-cases/             # Use cases / interactors
        │
        ├── todo.infrastructure/       # 🔌 Frameworks & Drivers
        │   ├── database/              # Data store implementations
        │   └── external/              # External service implementations
        │
        ├── todo.presentation/         # 🖥️ Interface Adapters
        │   ├── routes/                # API route handlers
        │   └── frontend/              # Next.js Frontend Application
        │       ├── package.json
        │       ├── next.config.js
        │       ├── tailwind.config.js
        │       └── src/
        │           └── app/           # Next.js App Router
        │
        └── todo.shared/               # 🛠️ Shared utilities (config, logger, swagger)
```

### Clean Architecture Layers

| Layer | Directory | Responsibility |
|-------|-----------|----------------|
| **Domain** | `core/src/todo.domain/` | Business entities, repository interfaces |
| **Application** | `core/src/todo.application/` | Use cases, business logic orchestration |
| **Infrastructure** | `core/src/todo.infrastructure/` | Database, external services implementations |
| **Presentation** | `core/src/todo.presentation/` | UI (Next.js frontend), API routes |
| **Shared** | `core/src/todo.shared/` | Configuration, logging, Swagger setup |

## 🎯 SOLID Principles

| Principle | Description |
|-----------|-------------|
| **Single Responsibility (SRP)** | Each class/module has one reason to change |
| **Open/Closed (OCP)** | Open for extension, closed for modification |
| **Liskov Substitution (LSP)** | Subtypes must be substitutable for base types |
| **Interface Segregation (ISP)** | Many specific interfaces over one general interface |
| **Dependency Inversion (DIP)** | Depend on abstractions, not concretions |

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.0.0
- npm
- OpenWeatherMap API key (free tier available at [openweathermap.org](https://openweathermap.org/api))

### Installation

```bash
# Clone and navigate to the project
cd TodoApp

# Install backend dependencies
cd core
npm install

# Install frontend dependencies
cd src/todo.presentation/frontend
npm install
```

### Environment Setup

Create a `.env` file in the `core/` directory:

```bash
cd core
cp .env.example .env
```

Then edit `.env` and add your OpenWeatherMap API key:

```env
PORT=3001
NODE_ENV=development
OPENWEATHERMAP_API_KEY=your_actual_api_key_here
```

## 📦 Running the Application

### Backend (Express API)

```bash
cd core
npm run dev
```

The backend server will start at **http://localhost:3001**

### Frontend (Next.js)

```bash
cd core/src/todo.presentation/frontend
npm run dev:webpack
```

The frontend will start at **http://localhost:3000**

Note: `npm run dev` uses Turbopack if you want the faster default.

### URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Documentation (Swagger)**: http://localhost:3001/api/docs
- **Health Check**: http://localhost:3001/api/health

## 🧪 Testing

Run the test suite from the `core/` directory:

```bash
cd core
npm test
```

**Test Coverage:**
- 65 tests across 5 test suites
- Domain entities (Todo)
- Application use cases (TodoUseCases, WeatherUseCases)
- Infrastructure (InMemoryStore, TodoRepository)

## 📡 API Endpoints

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Check API health status |

### Todos
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/todos` | Get all todos |
| GET | `/api/todos/:id` | Get a specific todo |
| POST | `/api/todos` | Create a new todo |
| PUT | `/api/todos/:id` | Update a todo |
| DELETE | `/api/todos/:id` | Delete a todo |

**Request Body (POST/PUT):**
```json
{
  "text": "Todo description",
  "completed": false
}
```

### Weather
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/weather?city=Cape Town` | Get weather by city name |
| GET | `/api/weather?lat=-33.9&lon=18.4` | Get weather by coordinates |

**Response:**
```json
{
  "location": "Cape Town",
  "country": "ZA",
  "temperature": 22.5,
  "feelsLike": 21.0,
  "humidity": 65,
  "description": "Clear sky",
  "icon": "01d",
  "windSpeed": 5.2,
  "timestamp": "2024-01-15T10:00:00Z"
}
```

## 📁 Building Features Step by Step

### 1. Define Domain Entity
Create your entity in `core/src/todo.domain/entities/`

### 2. Define Repository Interface
Create interface in `core/src/todo.domain/repositories/`

### 3. Implement Use Case
Create business logic in `core/src/todo.application/use-cases/`

### 4. Implement Repository
Create implementation in `core/src/todo.infrastructure/database/`

### 5. Create Controller & Routes
Add HTTP handlers in `core/src/todo.presentation/routes/`

### 6. Build UI Components (Frontend)
Create components in `core/src/todo.presentation/frontend/src/components/`

## 🛠️ Tech Stack

### Frontend
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion (animations)
- dnd-kit (drag & drop)

### Backend
- Node.js
- Express.js
- TypeScript
- tsx (fast TypeScript execution)

## 🧪 Key Concepts

### Dependency Rule
Dependencies always point inward. The inner layers (Domain) know nothing about outer layers (Infrastructure, Presentation).

```
Presentation → Application → Domain ← Infrastructure
```

### Repository Pattern
Domain defines interfaces (`IDataStore`), Infrastructure provides implementations (`InMemoryStore`).

## 📝 License

MIT
