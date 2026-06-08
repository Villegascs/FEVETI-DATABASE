'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './form.module.css';
import { ArrowLeft, Save } from 'lucide-react';

export default function NewAthletePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
      const res = await fetch('/api/athletes', {
        method: 'POST',
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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/admin/athletes" className={styles.backButton}>
          <ArrowLeft size={20} />
          <span>Volver</span>
        </Link>
        <h2>Registrar Nuevo Atleta</h2>
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
              <input
                id="birthDate"
                name="birthDate"
                type="date"
                required
                value={formData.birthDate}
                onChange={handleChange}
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
              <input
                id="joinDate"
                name="joinDate"
                type="date"
                value={formData.joinDate}
                onChange={handleChange}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="expiryDate">Fecha de Vencimiento del Carnet</label>
              <input
                id="expiryDate"
                name="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={handleChange}
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
            <button type="submit" className={styles.saveButton} disabled={loading}>
              <Save size={20} />
              <span>{loading ? 'Guardando...' : 'Guardar Atleta'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
