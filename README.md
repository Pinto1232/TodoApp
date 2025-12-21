# Todo App - Clean Architecture Monolith

A full-stack Todo application built with **Next.js** (Frontend) and **Node.js/Express** (Backend), following **Clean Architecture** principles and **SOLID** design patterns in a unified core structure.

## 🏗️ Architecture Overview

This project follows Clean Architecture with a **unified core** approach, where all layers are organized under a single `core/` directory:

```
TodoApp/
├── .gitignore
├── README.md
├── package-lock.json
└── core/                           # Unified application core
    ├── package.json                # Backend dependencies & scripts
    ├── tsconfig.json               # TypeScript configuration
    └── src/
        ├── app.ts                  # Express application setup
        ├── index.ts                # Server entry point
        │
        ├── domain/                 # 🎯 Enterprise Business Rules
        │   ├── entities/           # Business entities (Todo, User, etc.)
        │   └── repositories/       # Repository interfaces (contracts)
        │
        ├── application/            # 🔧 Application Business Rules
        │   └── use-cases/          # Use cases / interactors
        │
        ├── infrastructure/         # 🔌 Frameworks & Drivers
        │   └── database/           # Data store implementations
        │       └── InMemoryStore.ts
        │
        ├── presentation/           # 🖥️ Interface Adapters
        │   └── frontend/           # Next.js Frontend Application
        │       ├── package.json
        │       ├── next.config.js
        │       ├── tailwind.config.js
        │       └── src/
        │           └── app/        # Next.js App Router
        │
        └── shared/                 # 🛠️ Shared utilities & DI container
```

### Clean Architecture Layers

| Layer | Directory | Responsibility |
|-------|-----------|----------------|
| **Domain** | `core/src/domain/` | Business entities, repository interfaces |
| **Application** | `core/src/application/` | Use cases, business logic orchestration |
| **Infrastructure** | `core/src/infrastructure/` | Database, external services implementations |
| **Presentation** | `core/src/presentation/` | UI (Next.js frontend), API controllers |

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

### Installation

```bash
# Clone and navigate to the project
cd TodoApp

# Install backend dependencies
cd core
npm install

# Install frontend dependencies
cd src/presentation/frontend
npm install
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
cd core/src/presentation/frontend
npm run dev
```

The frontend will start at **http://localhost:3000**

### URLs

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health

## 📁 Building Features Step by Step

### 1. Define Domain Entity
Create your entity in `core/src/domain/entities/`

### 2. Define Repository Interface
Create interface in `core/src/domain/repositories/`

### 3. Implement Use Case
Create business logic in `core/src/application/use-cases/`

### 4. Implement Repository
Create implementation in `core/src/infrastructure/database/`

### 5. Create Controller & Routes
Add HTTP handlers in `core/src/presentation/` (for API endpoints)

### 6. Build UI Components (Frontend)
Create components in `core/src/presentation/frontend/src/`

## 🛠️ Tech Stack

### Frontend
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS

### Backend
- Node.js
- Express.js
- TypeScript

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