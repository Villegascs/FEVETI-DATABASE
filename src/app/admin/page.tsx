import { prisma } from '@/lib/prisma';
import styles from './admin.module.css';
import { Users, Activity, Target } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const totalAthletes = await prisma.athlete.count();
  const activeAthletes = await prisma.athlete.count({ where: { isActive: true } });
  const inactiveAthletes = totalAthletes - activeAthletes;

  return (
    <div>
      <h2 style={{ marginBottom: '1rem' }}>Resumen General</h2>
      <div className={styles.dashboardGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Users size={32} />
          </div>
          <div className={styles.statInfo}>
            <h3>Total Atletas</h3>
            <p>{totalAthletes}</p>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ color: 'var(--success)', backgroundColor: 'rgba(34, 197, 94, 0.1)' }}>
            <Activity size={32} />
          </div>
          <div className={styles.statInfo}>
            <h3>Atletas Activos</h3>
            <p>{activeAthletes}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ color: 'var(--danger)', backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
            <Target size={32} />
          </div>
          <div className={styles.statInfo}>
            <h3>Atletas Inactivos</h3>
            <p>{inactiveAthletes}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
