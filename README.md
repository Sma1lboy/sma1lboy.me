# sma1lboy's Personal Website

This is the repository for my personal website, a modern, performant, and feature-rich portfolio built with the latest web technologies. The project leverages a powerful tech stack to deliver a seamless user experience with a focus on clean code and maintainability.

## 🚀 Live Demo

[https://sma1lboy.me/](https://sma1lboy.me/)

## ✨ Features

- **Framework**: [React](https://react.dev/) - A declarative, component-based library for building user interfaces.
- **Build Tool**: [Vite](https://vitejs.dev/) - A next-generation frontend tooling that provides a faster and leaner development experience.
- **Language**: [TypeScript](https://www.typescriptlang.org/) - A statically typed superset of JavaScript that enhances code quality and maintainability.
- **Routing**: [TanStack Router](https://tanstack.com/router) - A fully type-safe router for React that enables efficient and scalable navigation.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework for rapidly building custom designs.
- **Animations**: [Framer Motion](https://www.framer.com/motion/) - A production-ready motion library for creating fluid animations.
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) - A small, fast, and scalable state-management solution.

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
