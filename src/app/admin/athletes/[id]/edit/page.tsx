'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import styles from '../../new/form.module.css';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { DatePicker } from '@/components/ui/DatePicker';

export default function EditAthletePage() {
  const router = useRouter();
  const params = useParams();
  const athleteId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    cedula: '',
    fullName: '',
    birthDate: '',
    modalities: '',
    association: '',
    club: '',
    joinDate: '',
    expiryDate: '',
    isActive: true,
    photoUrl: '',
  });

  useEffect(() => {
    const fetchAthlete = async () => {
      try {
        const res = await fetch(`/api/athletes/${athleteId}`);
        if (res.ok) {
          const athlete = await res.json();
          setFormData({
            cedula: athlete.cedula || '',
            fullName: athlete.fullName || '',
            birthDate: athlete.birthDate || '',
            modalities: athlete.modalities || '',
            association: athlete.association || '',
            club: athlete.club || '',
            joinDate: athlete.joinDate || '',
            expiryDate: athlete.expiryDate || '',
            isActive: athlete.isActive ?? true,
            photoUrl: athlete.photoUrl || '',
          });
        } else {
          setError('No se encontró el atleta.');
        }
      } catch (err) {
        setError('Error al cargar los datos del atleta.');
      } finally {
        setFetching(false);
      }
    };

    fetchAthlete();
  }, [athleteId]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) {
        alert('La imagen es muy grande. Por favor sube una imagen de menos de 1MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/athletes/${athleteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/admin/athletes');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || 'Error al guardar');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que deseas eliminar este atleta? Esta acción no se puede deshacer.')) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/athletes/${athleteId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.push('/admin/athletes');
        router.refresh();
      } else {
        setError('Error al eliminar el atleta.');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setDeleting(false);
    }
  };

  if (fetching) {
    return (
      <div className={styles.container}>
        <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--secondary)' }}>Cargando datos del atleta...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/admin/athletes" className={styles.backButton}>
          <ArrowLeft size={20} />
          <span>Volver</span>
        </Link>
        <h2>Editar Atleta</h2>
      </div>

      <div className={styles.formCard}>
        {error && <div className={styles.errorMessage}>{error}</div>}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.gridContainer}>
            <div className={styles.inputGroup} style={{ gridColumn: '1 / -1' }}>
              <label>Foto del Atleta (Opcional, Máx 1MB)</label>
              <div className={styles.photoUploadContainer}>
                {formData.photoUrl && (
                  <img src={formData.photoUrl} alt="Preview" className={styles.photoPreview} />
                )}
                <input
                  type="file"
                  accept="image/jpeg, image/png, image/webp"
                  onChange={handlePhotoUpload}
                  className={styles.fileInput}
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="cedula">Cédula de Identidad</label>
              <input
                id="cedula"
                name="cedula"
                type="text"
                required
                value={formData.cedula}
                onChange={handleChange}
                placeholder="Ej. 12345678"
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="fullName">Nombre Completo</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Nombres y Apellidos"
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="birthDate">Fecha de Nacimiento</label>
              <DatePicker
                id="birthDate"
                value={formData.birthDate}
                onChange={(value) => setFormData({ ...formData, birthDate: value })}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="association">Asociación</label>
              <input
                id="association"
                name="association"
                type="text"
                required
                value={formData.association}
                onChange={handleChange}
                placeholder="Asociación a la que pertenece"
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="club">Club</label>
              <input
                id="club"
                name="club"
                type="text"
                value={formData.club}
                onChange={handleChange}
                placeholder="Club al que pertenece"
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="modalities">Modalidades (separadas por coma)</label>
              <input
                id="modalities"
                name="modalities"
                type="text"
                required
                value={formData.modalities}
                onChange={handleChange}
                placeholder="Ej. Pistola Aire, Rifle 3 Posiciones"
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="joinDate">Fecha de Ingreso a FEVETI</label>
              <DatePicker
                id="joinDate"
                value={formData.joinDate}
                onChange={(value) => setFormData({ ...formData, joinDate: value })}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="expiryDate">Fecha de Vencimiento del Carnet</label>
              <DatePicker
                id="expiryDate"
                value={formData.expiryDate}
                onChange={(value) => setFormData({ ...formData, expiryDate: value })}
              />
            </div>

            <div className={styles.checkboxGroup}>
              <input
                id="isActive"
                name="isActive"
                type="checkbox"
                checked={formData.isActive}
                onChange={handleChange}
              />
              <label htmlFor="isActive">Atleta Activo</label>
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="button" onClick={handleDelete} className={styles.deleteButton} disabled={deleting}>
              <Trash2 size={20} />
              <span>{deleting ? 'Eliminando...' : 'Eliminar Atleta'}</span>
            </button>
            <button type="submit" className={styles.saveButton} disabled={loading}>
              <Save size={20} />
              <span>{loading ? 'Guardando...' : 'Guardar Cambios'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
