# sma1lboy.me

My corner of the internet. Built with React + Vite, deployed on Vercel.

🌐 **Live:** [sma1lboy.me](https://sma1lboy.me/)

## Stack

| Layer       | Tool                                                     |
| ----------- | -------------------------------------------------------- |
| Framework   | [React](https://react.dev/)                              |
| Bundler     | [Vite](https://vitejs.dev/)                              |
| Language    | [TypeScript](https://www.typescriptlang.org/)            |
| Routing     | [TanStack Router](https://tanstack.com/router)           |
| Styling     | [Tailwind CSS](https://tailwindcss.com/)                 |
| Motion      | [Framer Motion](https://www.framer.com/motion/)          |
| State       | [Zustand](https://zustand-demo.pmnd.rs/)                 |
| Runtime     | [Bun](https://bun.sh/)                                   |

## Quick Start

```bash
git clone https://github.com/sma1lboy/sma1lboy.me.git
cd sma1lboy.me
bun install
bun run dev
```

Dev server runs at `http://localhost:5173`.

## Scripts

```bash
bun run dev       # start dev server
bun run build     # production build
bun run preview   # preview the build
bun run lint      # eslint
bun run prettier  # format check
```

## Project Layout

```
src/
├── assets/      static assets
├── components/  React components (shared UI in components/ui)
├── constants/   static data
├── hooks/       custom hooks
├── routes/      TanStack Router routes
└── store/       Zustand stores
```

## Deployment

Auto-deploys to Vercel on push to `main`. Config lives in `vercel.json`.

## Contributing

PRs welcome — fork it, hack on it, send it over. For bigger changes open an issue first so we can chat.

## License

MIT — do whatever you want with it.
