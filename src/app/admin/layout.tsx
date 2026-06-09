'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './admin.module.css';
import { Users, FileDown, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className={styles.adminContainer}>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div className={styles.sidebarOverlay} onClick={closeSidebar}></div>
      )}

      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <img src="/logo-feveti.png" alt="Logo FEVETI" className={styles.logoIcon} style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
          <h2>FEVETI Admin</h2>
          <button className={styles.closeSidebarBtn} onClick={closeSidebar}>
            <X size={24} />
          </button>
        </div>
        
        <nav className={styles.nav}>
          <Link href="/admin" onClick={closeSidebar} className={`${styles.navLink} ${pathname === '/admin' ? styles.active : ''}`}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/athletes" onClick={closeSidebar} className={`${styles.navLink} ${pathname.startsWith('/admin/athletes') ? styles.active : ''}`}>
            <Users size={20} />
            <span>Atletas</span>
          </Link>
          <Link href="/admin/export" onClick={closeSidebar} className={`${styles.navLink} ${pathname === '/admin/export' ? styles.active : ''}`}>
            <FileDown size={20} />
            <span>Exportar Data</span>
          </Link>
        </nav>

        <div className={styles.sidebarFooter}>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <button className={styles.mobileMenuBtn} onClick={() => setIsSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <h1>Sistema de Gestión de Atletas</h1>
          </div>
        </header>
        <div className={styles.contentWrapper}>
          {children}
        </div>
      </main>
    </div>
  );
}
