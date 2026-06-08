'use client';

import { FileDown, Database } from 'lucide-react';
import styles from './export.module.css';

export default function ExportPage() {
  const handleExport = () => {
    // This will trigger the browser to download the file from the GET route
    window.location.href = '/api/export';
  };

  return (
    <div className={styles.container}>
      <h2>Exportar Base de Datos</h2>
      <p className={styles.subtitle}>
        Descarga toda la información de los atletas registrados en formato Excel (.xlsx).
      </p>

      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <Database size={48} className={styles.dbIcon} />
        </div>
        <h3>Copia de Seguridad y Reportes</h3>
        <p>
          El archivo exportado contendrá todos los datos: Cédula, Nombres, Modalidades, Asociación y el Estado actual de cada atleta.
        </p>
        
        <button onClick={handleExport} className={styles.exportBtn}>
          <FileDown size={24} />
          <span>Generar y Descargar Excel</span>
        </button>
      </div>
    </div>
  );
}
