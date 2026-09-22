# Todo Task - Frontend

A modern, responsive task manager UI built with React, TypeScript, and Vite.

## Tech Stack

- **Library:** React 19
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** Vanilla CSS

## Features

- ✅ Add new tasks with title and description
- ✏️ Edit existing tasks
- 🗑️ Delete tasks
- ☑️ Mark tasks as completed/pending
- 🔍 Filter tasks by status (All / Pending / Completed)
- 📊 Task completion stats
- 💫 Responsive design with modal forms

## Folder Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images, icons, etc.
│   ├── api.ts           # API functions (fetch, create, update, delete)
│   ├── App.tsx          # Main app component
│   ├── App.css          # Component-level styles
│   ├── index.css        # Global styles
│   └── main.tsx         # Entry point (React root render)
├── index.html           # HTML template
├── package.json
├── vite.config.ts       # Vite config (includes API proxy)
├── tsconfig.json
└── eslint.config.js
```

## Prerequisites

- Node.js (v18 or above)
- Backend server running on `http://localhost:5000`

## Getting Started

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Run the dev server

```bash
npm run dev
```

App will start on `http://localhost:5173`

### 3. Build for production

```bash
npm run build
```

### 4. Preview production build

```bash
npm run preview
```

## API Proxy

Vite is configured to proxy `/api` requests to `http://localhost:5000`, so no CORS issues during development.

```ts
// vite.config.ts
server: {
  proxy: {
    '/api': 'http://localhost:5000'
  }
}
```

## Available Scripts

| Script          | Command            | Description                    |
|-----------------|--------------------|--------------------------------|
| `npm run dev`   | `vite`             | Start dev server with HMR      |
| `npm run build` | `tsc -b && vite build` | Type-check and build for prod |
| `npm run lint`  | `eslint .`         | Run ESLint                     |
| `npm run preview` | `vite preview`   | Preview the production build   |

## Author

Aditya Maurya
