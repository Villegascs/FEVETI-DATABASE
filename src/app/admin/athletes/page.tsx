import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import styles from './athletes.module.css';
import { Plus, Edit, Trash2, QrCode, CreditCard } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AthletesPage() {
  const athletes = await prisma.athlete.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Directorio de Atletas</h2>
        <Link href="/admin/athletes/new" className={styles.addButton}>
          <Plus size={20} />
          <span>Registrar Atleta</span>
        </Link>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Cédula</th>
              <th>Nombre Completo</th>
              <th>Modalidades</th>
              <th>Asociación</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {athletes.map((athlete) => (
              <tr key={athlete.id}>
                <td className={styles.fontMono}>{athlete.cedula}</td>
                <td className={styles.fw500}>{athlete.fullName}</td>
                <td>
                  <span className={styles.badge}>{athlete.modalities}</span>
                </td>
                <td>{athlete.association}</td>
                <td>
                  {athlete.isActive ? (
                    <span className={`${styles.statusBadge} ${styles.statusActive}`}>Activo</span>
                  ) : (
                    <span className={`${styles.statusBadge} ${styles.statusInactive}`}>Inactivo</span>
                  )}
                </td>
                <td>
                  <div className={styles.actions}>
                    <Link href={`/admin/athletes/${athlete.id}/edit`} className={`${styles.actionBtn} ${styles.editBtn}`} title="Editar">
                      <Edit size={16} />
                    </Link>
                    <Link href={`/admin/carnet/${athlete.id}`} className={`${styles.actionBtn} ${styles.carnetBtn}`} title="Generar Carnet">
                      <CreditCard size={16} />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
            {athletes.length === 0 && (
              <tr>
                <td colSpan={6} className={styles.emptyState}>
                  No hay atletas registrados. Haz clic en "Registrar Atleta" para comenzar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
