import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'
import { useState } from 'react'
import styles from './App.module.css'

function App(): React.JSX.Element {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleDrop = async (e: React.DragEvent): Promise<void> => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && (droppedFile.name.endsWith('.xls') || droppedFile.name.endsWith('.xlsx'))) {
      setFile(droppedFile)
      console.log('Archivo:', droppedFile.name)
    } else {
      alert('Por favor, suelta un archivo Excel válido (.xls o .xlsx)')
    }
  }

  const handleProcess = async (): Promise<void> => {
    if (!file) return
    setLoading(true)
    try {
      // obtener la ruta real que provee Electron y enviarla al Main
      const filePath = await window.api.getFilePath(file)
      if (!filePath) {
        alert('No se encontró la ruta del archivo en el objeto File.')
        setLoading(false)
        return
      }
      await window.api.procesarArchivo(filePath)
      alert('Archivo procesado con éxito')
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className={styles.container}>
      <img alt="logo" className="logo" src={electronLogo} />
      <div
        className={[styles.dropZone, file && styles.hasFile].filter(Boolean).join(' ')}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {file ? (
          `Archivo listo: ${file.name} ✅`
        ) : (
          <>
            <div>Arrastra tu archivo de asistencia aquí</div>
            <div className={styles.emoji} aria-hidden>
              👇
            </div>
          </>
        )}
      </div>

      {file && (
        <button onClick={handleProcess} disabled={loading}>
          {loading ? 'Procesando...' : 'Generar Reporte'}
        </button>
      )}
      <Versions></Versions>
    </div>
  )
}

export default App
