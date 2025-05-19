"use client";
import { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { Button, Card, Container, Row, Col, Spinner } from "react-bootstrap";

export default function ProductosPage() {
  const [products, setProducts] = useState([]); // Todos los productos
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;

  const { addToCart } = useCart();

  useEffect(() => {
    // Fetch productos del dashboard
    fetch("http://localhost:5000/api/products")
      .then((res) => {
        if (!res.ok) throw Error("Error al obtener los productos del dashboard");
        return res.json();
      })
      .then((dashboard) => {
        // Normaliza los productos del dashboard para que tengan las mismas claves
        const dashboardNormalized = dashboard.map((p) => ({
          ...p,
          id: p._id || p.id,
          title: p.title || p.name,
          image: p.image || "https://via.placeholder.com/200",
          price: p.price || 0,
        }));
        setProducts(dashboardNormalized);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Calcular índices de paginación
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(products.length / productsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <Container className="mt-4">
      <h1>Lista de productos</h1>

      {loading ? (
        <Spinner animation="border" />
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <>
          <Row>
            {currentProducts.map((product) => (
              <Col key={product.id} md={4} className="mb-4">
                <Card>
                  <Card.Img
                    variant="top"
                    src={product.image}
                    style={{ height: "200px", objectFit: "contain" }}
                  />
                  <Card.Body>
                    <Card.Title>{product.title}</Card.Title>
                    <Card.Text>
                      <strong>${product.price}</strong>
                    </Card.Text>
                    <Button variant="primary" onClick={() => addToCart(product)}>
                      🛒 Agregar al carrito
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Botones de navegación */}
          <div className="d-flex justify-content-between align-items-center mt-4">
            <Button onClick={prevPage} disabled={currentPage === 1}>
              ⬅ Anterior
            </Button>
            <span>Página {currentPage} de {totalPages}</span>
            <Button onClick={nextPage} disabled={currentPage === totalPages}>
              Siguiente ➡
            </Button>
          </div>
        </>
      )}

      {/* Contador decorativo */}
      <Contador />
    </Container>
  );
}

// 👇 Componente del contador decorativo
function Contador() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count === 5) document.body.style.backgroundColor = "red";
    else if (count === 10) document.body.style.backgroundColor = "blue";
    else if (count === 15) document.body.style.backgroundColor = "green";
    else document.body.style.backgroundColor = "white";
  }, [count]);

  return (
    <div className="mt-5">
      <h2>Contador: {count}</h2>
      <Button onClick={() => setCount(count + 1)}>Incrementar</Button>
    </div>
  );
}
