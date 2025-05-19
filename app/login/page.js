'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Card, message } from 'antd';
import axios from 'axios';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', values);
      const { token, user } = response.data;
      const role = user?.role;
      localStorage.setItem('token', token);
      if (role) {
        localStorage.setItem('role', role);
      }
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }
      message.success('Inicio de sesión exitoso');
      
      // Redirección basada en el rol
      if (role === 'admin') {
        router.replace('/dashboard');
      } else {
        router.replace('/');
      }
    } catch (error) {
      message.error('Credenciales incorrectas');
    }
    setLoading(false);
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: '#f0f2f5'
    }}>
      <Card title="Iniciar Sesión" style={{ width: 400 }}>
        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Por favor ingrese su email' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Contraseña"
            name="password"
            rules={[{ required: true, message: 'Por favor ingrese su contraseña' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Iniciar Sesión
            </Button>
          </Form.Item>
          
          <div style={{ textAlign: 'center' }}>
            <a href="/register">¿No tienes cuenta? Regístrate aquí</a>
          </div>
        </Form>
      </Card>
    </div>
  );
}