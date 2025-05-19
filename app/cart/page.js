"use client";
import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { Button, Container } from "react-bootstrap";
import styles from "../styles/cart.module.css";
import { Modal } from 'antd';
import PasarelasPago from "../pasarelas/page";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cartItems, increaseQuantity, decreaseQuantity, removeFromCart } = useCart();
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleProceedToPay = () => {
    // Verificar si el usuario está logueado
    if (typeof window !== "undefined") {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      if (!token || !user) {
        router.push('/login');
        return;
      }
    }
    setShowModal(true);
  };

  return (
    <Container className={styles.cartContainer}>
      <h1>Tu Carrito</h1>
      {cartItems.length === 0 ? (
        <p>No tienes productos en el carrito.</p>
      ) : (
        cartItems.map((product) => (
          <div key={product.id} className={styles.cartItem}>
            <img src={product.image} alt={product.title} />
            <div>
              <strong>{product.title}</strong>
              <p>${parseFloat(product.price).toFixed(2)}</p>
            </div>
            <div className={styles.cartItemQuantity}>
              <Button variant="secondary" onClick={() => decreaseQuantity(product.id)}>-</Button>
              <span>{product.quantity}</span>
              <Button variant="secondary" onClick={() => increaseQuantity(product.id)}>+</Button>
            </div>
            <Button variant="danger" onClick={() => removeFromCart(product.id)} style={{ marginLeft: 10 }}>
              Eliminar
            </Button>
          </div>
        ))
      )}
      {cartItems.length > 0 && (
        <div className={styles.cartSummary}>
          <strong>Total:</strong>
          <span>${total.toFixed(2)}</span>
        </div>
      )}
      <Button type="primary" onClick={handleProceedToPay}>
        Proceder al pago
      </Button>
      <Modal
        title="Elige tu método de pago"
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
      >
        <PasarelasPago />
      </Modal>
    </Container>
  );
}
