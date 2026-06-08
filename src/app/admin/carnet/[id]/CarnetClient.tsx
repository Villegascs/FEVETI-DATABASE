'use client';

import { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import styles from './carnet.module.css';
import { Download, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function CarnetClient({ athlete, publicProfileUrl }: { athlete: any, publicProfileUrl: string }) {
  const carnetRef = useRef<HTMLDivElement>(null);

  const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${publicProfileUrl}` : publicProfileUrl;

  const downloadCarnet = async () => {
    if (!carnetRef.current) return;
    
    try {
      const canvas = await html2canvas(carnetRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: null
      });
      
      const link = document.createElement('a');
      link.download = `carnet_${athlete.cedula}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Error generando el carnet:', err);
      alert('Hubo un error al generar la imagen del carnet.');
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('es-VE');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/admin/athletes" className={styles.backButton}>
          <ArrowLeft size={20} />
          <span>Volver a Atletas</span>
        </Link>
        <button onClick={downloadCarnet} className={styles.downloadBtn}>
          <Download size={20} />
          <span>Descargar Carnet</span>
        </button>
      </div>

      <div className={styles.previewContainer}>
        <div ref={carnetRef} className={styles.carnetWrapper}>
          <div className={styles.carnet}>
            <div className={styles.carnetHeader}>
              <img src="/logo-feveti.png" alt="Logo FEVETI" className={styles.carnetLogo} />
              <span>FEDERACIÓN VENEZOLANA DE TIRO</span>
            </div>
            
            <div className={styles.carnetBody}>
              <div className={styles.photoContainer}>
                {athlete.photoUrl ? (
                  <img src={athlete.photoUrl} alt="Foto" className={styles.photo} crossOrigin="anonymous" />
                ) : (
                  <div className={styles.photoPlaceholder}>FOTO</div>
                )}
              </div>
              
              <div className={styles.infoContainer}>
                <h3 className={styles.name}>{athlete.fullName}</h3>
                <p className={styles.cedula}>V-{athlete.cedula}</p>
                
                <div className={styles.detailsGrid}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Asociación</span>
                    <span className={styles.detailValue}>{athlete.association}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Club</span>
                    <span className={styles.detailValue}>{athlete.club || '—'}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Ingreso</span>
                    <span className={styles.detailValue}>{formatDate(athlete.joinDate)}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Vence</span>
                    <span className={styles.detailValue}>{formatDate(athlete.expiryDate)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.carnetFooter}>
              <div className={styles.qrWrapper}>
                <QRCodeSVG value={fullUrl} size={56} level="H" includeMargin={false} />
              </div>
              <div className={styles.footerText}>
                <p>ESCANEA EL QR PARA VERIFICAR</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
