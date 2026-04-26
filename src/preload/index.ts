import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  // Enviamos la ruta del archivo y esperamos que Main nos diga si todo ok
  procesarArchivo: (file: File) => ipcRenderer.invoke('procesar-archivo', file),
  // Para elegir dónde guardar
  seleccionarDestino: (nombreSugerido: string) =>
    ipcRenderer.invoke('seleccionar-destino', nombreSugerido)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
