# Copilot instructions

## Stack and entry points

- Electron + React 19 + TypeScript, built by electron-vite.
- Main process: `src/main/index.ts`
- Preload bridge: `src/preload/index.ts` and `src/preload/index.d.ts`
- React renderer: `src/renderer/src/main.tsx` and `src/renderer/src/App.tsx`
- Electron/Vite configuration: `electron.vite.config.ts`
- Packaging configuration: `electron-builder.yml`

The renderer uses `@renderer/*` for imports under `src/renderer/src`. The main process, preload scripts, and renderer have separate TypeScript projects (`tsconfig.node.json` and `tsconfig.web.json`).

## Commands

Use pnpm for project dependencies:

- Install: `pnpm install`
- Development app: `pnpm dev`
- Preview the built app: `pnpm start`
- Format files: `pnpm format`
- Lint: `pnpm lint`
- Type-check main/preload and renderer: `pnpm typecheck`
- Full build: `pnpm build`
- Unpacked distribution: `pnpm build:unpack`
- Platform packages: `pnpm build:win`, `pnpm build:mac`, or `pnpm build:linux`

Useful package-script equivalents:

- Main/preload type-check only: `pnpm typecheck:node`
- Renderer type-check only: `pnpm typecheck:web`
- Lint one file: `pnpm exec eslint --cache <path>`
- Format one file: `pnpm exec prettier --write <path>`

There is currently no test script or test framework configured, so there is no per-test command.

## Architecture and data flow

The app converts an attendance Excel file into an Excel report:

1. `App.tsx` validates a dropped `.xls` or `.xlsx` file and stores the browser `File` object.
2. `window.api.getFilePath(file)` converts the dropped file to a real filesystem path through Electron's `webUtils`.
3. `window.api.procesarArchivo(path)` invokes the `procesar-archivo` IPC handler.
4. The main process opens a native save dialog and calls
   `convertirAsistencia.generarReporte(inputPath, outputPath)`.

Keep privileged filesystem, native dialogs, and conversion-library work in the main process. Expose only the minimum required operations through `contextBridge` in `src/preload/index.ts`, and mirror custom APIs in `src/preload/index.d.ts` for renderer TypeScript.

Electron loads the renderer from the Vite development server while developing and from `out/renderer/index.html` in packaged builds. Browser navigation is denied and external URLs are opened with the system shell.

## Repository conventions

- Prettier uses `singleQuote: true`, `semi: false`, `printWidth: 100`, and no trailing commas.
- Match the existing Spanish names and strings for user-facing file-processing behavior, while preserving English names for Electron/React infrastructure and IPC identifiers.
- Add new renderer imports from `src/renderer/src` through the `@renderer` alias when appropriate.
- Keep preload APIs typed on `Window.api`; when an IPC API changes, update both `src/preload/index.ts` and `src/preload/index.d.ts`.
- Native save/open dialog behavior belongs in `src/main/index.ts` unless it is extracted into a small main-process module.
- The save handler currently appends `.xlsx` to the selected output path. Preserve this path behavior unless changing the selected filename contract deliberately.
