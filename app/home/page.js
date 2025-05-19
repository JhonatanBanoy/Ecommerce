'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Typography, Button } from 'antd';

const { Title } = Typography;

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    router.push('/login');
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Title level={2}>Bienvenido a la Página Principal</Title>
        <p>Esta es la página para usuarios regulares.</p>
        <Button type="primary" danger onClick={handleLogout}>
          Cerrar Sesión
        </Button>
      </Card>
    </div>
  );
} 