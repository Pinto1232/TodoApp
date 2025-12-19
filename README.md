# Todo App - Full Stack Clean Architecture

A full-stack Todo application built with **Next.js** (Frontend) and **Node.js/Express** (Backend), following **Clean Architecture** principles and **SOLID** design patterns.

## 🏗️ Architecture Overview

This project follows Clean Architecture with clear separation of concerns:

```
├── frontend/                    # Next.js Frontend
│   └── src/
│       ├── app/                # Next.js App Router pages
│       ├── domain/             # Business entities & repository interfaces
│       ├── application/        # Custom hooks (use cases)
│       ├── infrastructure/     # API repository implementations
│       └── presentation/       # React components
│
├── backend/                    # Node.js Backend
│   └── src/
│       ├── domain/            # Business entities & repository interfaces
│       ├── application/       # Use cases & DTOs
│       ├── infrastructure/    # Repository implementations
│       ├── presentation/      # Controllers, routes & middlewares
│       └── shared/            # DI container & utilities
```

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
cd TodoApp

# Install root dependencies (concurrently)
npm install

# Install frontend and backend dependencies
npm run install:all

# Or install each separately
cd frontend && npm install
cd ../backend && npm install
```

## 📦 Project Structure

This project uses a **monorepo structure** with isolated dependencies:

```
TodoApp/
├── package.json         # Root coordinator (concurrently for running both servers)
├── node_modules/        # Minimal root dependencies (~30 packages)
├── frontend/
│   ├── package.json     # Frontend dependencies
│   └── node_modules/    # Frontend packages (isolated)
└── backend/
    ├── package.json     # Backend dependencies
    └── node_modules/    # Backend packages (isolated)
```

**Why this structure?**
- Each project manages its own dependencies independently
- Clearer isolation between frontend and backend
- Follows industry standard for monorepos
- Root `package.json` provides convenience scripts to run both servers

### Development

```bash
# Run both frontend and backend concurrently
npm run dev
```

### Running Backend Only

```bash
# From the project root
npm run dev:backend

# Or navigate to backend folder
cd backend
npm run dev
```

The backend server will start at **http://localhost:3001**

### Running Frontend Only

```bash
# From the project root
npm run dev:frontend

# Or navigate to frontend folder
cd frontend
npm run dev
```

The frontend will start at **http://localhost:3000**

### URLs

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health

## 📁 Building Features Step by Step

### 1. Define Domain Entity (Backend)
Create your entity in `backend/src/domain/entities/`

### 2. Define Repository Interface (Backend)
Create interface in `backend/src/domain/repositories/`

### 3. Implement Use Case (Backend)
Create business logic in `backend/src/application/usecases/`

### 4. Implement Repository (Backend)
Create implementation in `backend/src/infrastructure/repositories/`

### 5. Create Controller & Routes (Backend)
Add HTTP handlers in `backend/src/presentation/`

### 6. Mirror Types (Frontend)
Create matching types in `frontend/src/domain/entities/`

### 7. Create API Repository (Frontend)
Implement API calls in `frontend/src/infrastructure/repositories/`

### 8. Create Custom Hook (Frontend)
Add state management in `frontend/src/application/hooks/`

### 9. Build UI Components (Frontend)
Create components in `frontend/src/presentation/components/`

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

## 📝 License

MIT