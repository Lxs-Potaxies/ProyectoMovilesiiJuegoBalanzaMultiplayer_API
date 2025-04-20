const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

// Configurar express para manejar datos JSON
app.use(express.json());  // Esto es importante para poder leer req.body

// Crea la instancia de Socket.io
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Rutas REST
app.use("/api/players", require("./routes/playerRoutes"));
app.use("/api/games", require("./routes/gameRoutes"));
app.use("/api/weighings", require("./routes/weighingRoutes")(io));

// Conexión a MongoDB
mongoose.connect("mongodb://localhost:27017/juego-balanzas", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("✅ Conectado a MongoDB");

  server.listen(3000, () => {
    console.log("🚀 Servidor corriendo en http://localhost:3000");
  });
});
