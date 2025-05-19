'use client';  // Marca el archivo como solo para cliente

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import styles from "../styles/Navbar.module.css";
import { useCart } from '../../../my_project/context/CartContext'; // Importar el contexto
import Dashboard from './Dashboard';
import { Dropdown, Menu, Button, Avatar } from 'antd';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { cartItems } = useCart(); // Obtener los items del carrito
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [userImage, setUserImage] = useState('');

  // Leer el usuario de localStorage solo en el cliente
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        setUserName(user?.name || '');
        setUserImage(user?.profileImage || `https://api.dicebear.com/7.x/avatars/svg?seed=${user?.email}`);
      } catch {
        setUserName('');
      }
    }
  }, []);

  const handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('user');
      setUserName('');
      router.push('/');
    } else if (key === 'profile') {
      router.push('/profile');
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="profile">Setting</Menu.Item>
      <Menu.Item key="logout">Cerrar sesión</Menu.Item>
    </Menu>
  );

  return (
    <nav className={styles.navbar}>
      <ul>
        <li><Link href='/'>Home</Link></li>
        <li><Link href='/products'>productos</Link></li>
        <li><Link href='/contact'>contacto</Link></li>
        {/* styles for cards */}
        <li className={styles.cartContainer}>
          <Link href='/cart' className={styles.cartlink}>
            <i className="bi bi-cart-fill" /> {/* Icono del carrito */}
            {cartItems.length > 0 && (
             <span className={styles.cartBadge}>
            {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
           </span>
          )}
          </Link>
        </li>
        {/* Usuario y menú desplegable */}
        {userName && (
          <li>
            <Dropdown overlay={menu} placement="bottomRight">
              <Button type="text" style={{ marginLeft: 8, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Avatar src={userImage} />
                {userName}
              </Button>
            </Dropdown>
          </li>
        )}
      </ul>
    </nav>
  );
}
