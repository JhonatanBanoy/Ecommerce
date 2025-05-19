// server.js
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");

// Importar las rutas
const productRoutes = require("./routes/product.routes");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const ordersRouter = require("./routes/order.routes");

const app = express();

// Verificar si la URI de MongoDB se carga correctamente
console.log("MONGO_URI:", process.env.MONGO_URI);

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Conectado a la base de datos de MongoDB"))
  .catch((error) => {
    console.error("Error al conectar con MongoDB:", error);
    console.log("URI usada para la conexión:", process.env.MONGO_URI);
  });

// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Rutas de la API
app.use("/api/auth", authRoutes);    // Para login, register, etc.
app.use("/api/auth", userRoutes);    // Para /api/auth/profile, etc.
app.use("/api/products", productRoutes);
app.use("/api/orders", ordersRouter);

// Ruta principal (Opcional)
app.get("/", (req, res) => {
  res.send("API Ecommerce funcionando 🚀");
});

// Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});