# Pochi Rules for sma1lboy.me

This document contains specific rules and preferences for Pochi when working on this project.

## Package Manager

**ALWAYS use `bun` instead of `npm` for this project.**

### Commands to use:

- `bun install` instead of `npm install`
- `bun run dev` instead of `npm run dev`
- `bun run build` instead of `npm run build`
- `bun run preview` instead of `npm run preview`
- `bun add <package>` instead of `npm install <package>`
- `bun remove <package>` instead of `npm uninstall <package>`

### Why bun?

- Faster installation and execution
- Better performance for development workflows
- Native TypeScript support
- Improved dependency resolution

## Development Workflow

1. **Installation**: Always use `bun install` when setting up dependencies
2. **Development**: Use `bun run dev` to start the development server (typically runs on port 5173)
3. **Building**: Use `bun run build` for production builds
4. **Adding packages**: Use `bun add <package-name>` for new dependencies

### Development Server

- The development server typically runs on `http://localhost:5173`
- If port 5173 is occupied, Vite will automatically find the next available port

## Project Structure

This is a React + TypeScript + Vite project with:

- TanStack Router for routing
- Framer Motion for animations
- Tailwind CSS for styling
- Custom UI components in `src/components/ui/`

## Code Style

- Use TypeScript for all new files
- Follow existing component patterns
- Use Tailwind CSS for styling
- **All page component development must follow our tailwind.config.ts settings to avoid creating components with specific colors**
- Implement proper error handling
- Write clean, readable code with appropriate comments

## Important Notes

- Never use npm commands - always use bun equivalents
- Maintain consistency with existing code patterns
- Test changes before committing
- Follow the established project structure
