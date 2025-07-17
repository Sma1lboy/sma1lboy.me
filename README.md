# sma1lboy's Personal Website

This is the repository for my personal website, built with React, TypeScript, and Vite.

## 🚀 Live Demo

[https://sma1lboy.me/](https://sma1lboy.me/)

## ✨ Features

- **Framework**: [React](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Routing**: [TanStack Router](https://tanstack.com/router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

## 🛠️ Setup and Installation

To get started with this project, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/sma1lboy/sma1lboy.me.git
   cd sma1lboy.me
   ```

2. **Install dependencies using bun:**

   ```bash
   bun install
   ```

3. **Run the development server:**
   ```bash
   bun run dev
   ```
   The application will be available at `http://localhost:5173`.

## NPM Scripts

- `bun run dev`: Starts the development server.
- `bun run build`: Builds the application for production.
- `bun run preview`: Previews the production build locally.
- `bun run lint`: Lints the codebase.
- `bun run prettier`: Checks for formatting errors.

## 📁 Project Structure

```
.
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── ui/
│   │   └── ...
│   ├── constants/
│   ├── hooks/
│   ├── routes/
│   ├── store/
│   └── ...
├── package.json
└── vite.config.ts
```

- **`src/components`**: Contains all React components, with shared UI components in `src/components/ui`.
- **`src/constants`**: Holds static data and constants.
- **`src/hooks`**: Custom React hooks.
- **`src/routes`**: Route definitions for TanStack Router.
- **`src/store`**: Zustand stores for state management.

## 🤝 Contributing
