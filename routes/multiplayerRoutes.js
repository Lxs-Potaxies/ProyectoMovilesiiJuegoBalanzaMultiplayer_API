const express = require("express");
const router = express.Router();
const controller = require("../controllers/multiplayerController");

router.post("/session", controller.createSession);         // Crear sesión multijugador
router.post("/move", controller.registerMove);             // Registrar movimiento
router.put("/finalize", controller.finalizeSession);       // Registrar pesos finales
router.get("/session/:sessionId", controller.getSession);  // Obtener info de la sesión

module.exports = router;
