import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import styles from './publicProfile.module.css';
import { ShieldCheck, User } from 'lucide-react';
import Image from 'next/image';

export default async function PublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const athlete = await prisma.athlete.findUnique({
    where: { id: resolvedParams.id }
  });

  if (!athlete) {
    notFound();
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.profileCard}>
        <div className={styles.header}>
          <Image src="/logo-feveti.png" alt="Logo FEVETI" width={80} height={80} className={styles.logo} />
          <h1>FEDERACIÓN VENEZOLANA DE TIRO</h1>
          <p>Verificación de Atleta Oficial</p>
        </div>

        <div className={styles.content}>
          <div className={styles.photoSection}>
            <div className={styles.photoContainer}>
              {athlete.photoUrl ? (
                <img src={athlete.photoUrl} alt="Foto del Atleta" className={styles.photo} />
              ) : (
                <User size={64} className={styles.photoPlaceholder} />
              )}
            </div>
          </div>

          <div className={styles.detailsSection}>
            <h2 className={styles.name}>{athlete.fullName}</h2>
            <p className={styles.cedula}>V-{athlete.cedula}</p>

            <div className={styles.infoGrid}>
              <div className={styles.infoBox}>
                <span className={styles.infoLabel}>Asociación</span>
                <span className={styles.infoValue}>{athlete.association}</span>
              </div>
              <div className={styles.infoBox}>
                <span className={styles.infoLabel}>Club</span>
                <span className={styles.infoValue}>{athlete.club || '—'}</span>
              </div>
              <div className={styles.infoBox} style={{ gridColumn: '1 / -1' }}>
                <span className={styles.infoLabel}>Registro FEVETI</span>
                <span className={styles.infoValue}>
                  {athlete.joinDate
                    ? new Date(athlete.joinDate).toLocaleDateString('es-VE')
                    : new Date(athlete.createdAt).toLocaleDateString('es-VE')}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <ShieldCheck size={24} className={styles.verifiedIcon} />
          <p>Información verificada por la Federación Venezolana de Tiro.</p>
        </div>
      </div>
    </div>
  );
}
