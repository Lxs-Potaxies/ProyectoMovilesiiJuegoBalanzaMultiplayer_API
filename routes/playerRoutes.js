const express = require("express");
const router = express.Router();
const { createPlayer, getAllPlayers, updatePlayer } = require("../controllers/playerController");

// Ruta para crear un jugador
router.post("/", createPlayer);

module.exports = router;
