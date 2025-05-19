'use client';

import React, { useEffect, useState } from 'react';
import Dashboard from '../components/Dashboard';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');

      if (!token || role !== 'admin') {
        router.push('/');
        return;
      }
      setIsAdmin(true);
      setLoading(false);
    };

    checkAdmin();
  }, [router]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div>
      <Dashboard />
    </div>
  );
}