# NF-e Manager — Front-end

A single-page application for managing **Notas Fiscais Eletrônicas (NF-e)** built with **Angular 21** and **Tailwind CSS 4**.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture Overview](#architecture-overview)
- [API Integration](#api-integration)
- [Data Interfaces](#data-interfaces)
- [Getting Started](#getting-started)
  - [Running with Docker (recommended)](#running-with-docker-recommended)
  - [Running locally without Docker](#running-locally-without-docker)
- [Environment & Configuration](#environment--configuration)

---

## Features

| Module | Description |
|---|---|
| **Authentication** | Login and Register forms with JWT stored in LocalStorage |
| **Auth Guard** | Protects all `/dashboard` routes — redirects unauthenticated users to `/login` |
| **HTTP Interceptor** | Automatically attaches `Authorization: Bearer <token>` to every API request |
| **Upload** | Drag-and-drop or file-picker to upload NF-e XML files, with per-file success/error feedback |
| **Notas de Entrada** | Paginated table (50 items/page) listing all imported NF-e documents |
| **NF-e Detail** | Full detail view with header info and an itemized products table |
| **Toast Notifications** | Global non-blocking success/error/info messages |

---

## Tech Stack

- **Angular 21** — Standalone components, Signals, functional guards and interceptors, `@if`/`@for` control flow
- **Tailwind CSS 4** — Utility-first styling via PostCSS plugin
- **Reactive Forms** — Form validation for login and register
- **Angular Router** — Lazy-loaded routes for optimal bundle splitting
- **Docker** — Containerised development environment

---

## Project Structure

```
src/
└── app/
    ├── app.ts                  # Root component (RouterOutlet + Toast)
    ├── app.html                # Root template
    ├── app.routes.ts           # All application routes
    ├── app.config.ts           # provideRouter, provideHttpClient + interceptor
    │
    ├── interfaces/             # TypeScript data contracts
    │   ├── nfe.interface.ts    # NFe, NFeItem, NFeListResponse
    │   └── auth.interface.ts   # LoginRequest, RegisterRequest, AuthResponse
    │
    ├── core/                   # App-wide singletons
    │   ├── guards/
    │   │   └── auth.guard.ts       # CanActivateFn — checks JWT presence
    │   ├── interceptors/
    │   │   └── auth.interceptor.ts # HttpInterceptorFn — injects Bearer token
    │   └── services/
    │       ├── auth.service.ts     # login(), register(), logout(), getToken()
    │       ├── nfe.service.ts      # getList(), getById(), upload()
    │       └── toast.service.ts    # Signal-based toast queue
    │
    ├── shared/                 # Reusable UI pieces
    │   ├── components/
    │   │   └── toast/
    │   │       └── toast.component.ts  # Renders the live toast stack
    │   └── utils/
    │       └── format.utils.ts     # Currency, date, CNPJ formatters
    │
    └── features/               # Page-level feature modules
        ├── auth/
        │   ├── auth-base.component.ts      # Shared auth base
        │   ├── login/
        │   │   ├── login.component.ts      # Reactive Form + authService.login()
        │   │   └── login.component.html
        │   └── register/
        │       ├── register.component.ts   # Reactive Form + password confirmation
        │       └── register.component.html
        ├── layout/
        │   ├── layout.component.ts         # Shell: top bar + RouterOutlet
        │   ├── layout.component.html
        │   └── sidebar/
        │       ├── sidebar.component.ts    # Nav items + logout button
        │       └── sidebar.component.html
        ├── upload/
        │   ├── upload.component.ts         # Drag-drop logic + nfeService.upload()
        │   └── upload.component.html
        └── nfe/
            ├── nfe-list/
            │   ├── nfe-list.component.ts   # Pagination, table, row click
            │   └── nfe-list.component.html
            └── nfe-detail/
                ├── nfe-detail.component.ts # Load by :id, items table
                └── nfe-detail.component.html
```

---

## Architecture Overview

```
Browser
  │
  ├─ /login  ──────────────────────────► LoginComponent
  ├─ /register ────────────────────────► RegisterComponent
  │
  └─ /dashboard  [authGuard]
        │
        ├─ LayoutComponent (Sidebar + TopBar)
        │     │
        │     ├─ /upload ──────────────► UploadComponent
        │     ├─ /nfe ─────────────────► NFeListComponent
        │     └─ /nfe/:id ─────────────► NFeDetailComponent
        │
        └─ All HTTP requests pass through authInterceptor
             └─ Adds: Authorization: Bearer <jwt>
```

**State management** is intentionally simple — Angular Signals are used for local component state (loading flags, lists, toast queue). There is no global store.

---

## API Integration

All API calls are made to `{apiUrl}/api/v1`, where `apiUrl` is set in `src/environments/environment.ts`. Expected backend endpoints:

| Method | Path | Used by |
|---|---|---|
| `POST` | `/api/v1/auth/login` | `AuthService.login()` |
| `POST` | `/api/v1/auth/register` | `AuthService.register()` |
| `POST` | `/api/v1/nfe/upload` | `NFeService.upload()` |
| `GET` | `/api/v1/nfe?page=1&limit=50` | `NFeService.getList()` |
| `GET` | `/api/v1/nfe/:id` | `NFeService.getById()` |

The backend is a **NestJS + Prisma** REST API. The JWT token returned on login/register is stored in `localStorage` under the key `nfe_token` and injected into every subsequent request by the `authInterceptor`.

---

## Data Interfaces

```typescript
export interface NFe {
  id: string;
  access_key: string;   // 44-digit NF-e access key
  number: string;       // NF-e number
  series: string;       // Series
  issue_date: Date;
  issuer_name: string;  // Issuer name
  issuer_cnpj: string;  // Issuer CNPJ
  total_value: number;
  items: NFeItem[];
  created_at: Date;
}

export interface NFeItem {
  id: string;
  code: string;
  description: string;
  ncm: string;          // Fiscal product code
  quantity: number;
  unit_price: number;
  total_value: number;
  nfe_id: string;       // Foreign key back to NFe
}
```

---

## Getting Started

### Running with Docker (recommended)

**Prerequisites:** Docker and Docker Compose installed.

```bash
# 1. Clone the repository
git clone git@github.com:leoc0104/nfe-ui.git
cd nfe-ui

# 2. Start the dev server
docker compose up
```

The app will be available at **http://localhost:4200**.

Hot-reload is enabled via `--poll 2000` — file changes on the host are reflected inside the container automatically.

> **First-time permission fix:** If `npm install` fails with `EACCES`, run once:
> ```bash
> docker compose run --rm --user root app chown -R node:node /app/node_modules
> ```
> Then start normally with `docker compose up`.

---

## Environment & Configuration

| Setting | Value | Where |
|---|---|---|
| API base URL | `environment.apiUrl` + `/api/v1` | `src/environments/environment.ts` |
| JWT storage key | `nfe_token` | `core/services/auth.service.ts` |
| Page size | `50` | `features/nfe/nfe-list/nfe-list.component.ts` |
| Dev server port | `4200` | `docker-compose.yml` |

To point the app at a different backend, update `apiUrl` in `src/environments/environment.ts`::

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
};
```
