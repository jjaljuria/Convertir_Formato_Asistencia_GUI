import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
    seleccionarDestino: (nombre: string) => Promise<string | undefined>
    procesarArchivo: (path: string) => Promise<unknown>
  }
}
