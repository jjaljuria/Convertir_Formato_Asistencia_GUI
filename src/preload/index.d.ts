import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      seleccionarDestino: (nombre: string) => Promise<string | undefined>
      procesarArchivo: (path: string) => Promise<{ success: boolean }>
      getFilePath: (file: File) => Promise<string>
    }
  }
}
