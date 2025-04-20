const Player = require("../models/Player");

exports.createPlayer = async (req, res) => {
  try {
    console.log("Datos recibidos en el servidor:", req.body);  // Verificar que req.body tenga los datos esperados

    // Crear el jugador
    const player = new Player(req.body);
    await player.save();

    res.status(201).json(player);  // Responder con el jugador creado
  } catch (err) {
    console.error("Error al crear jugador:", err);
    res.status(400).json({ error: err.message });
  }
};

// Obtener todos los jugadores
exports.getAllPlayers = async (req, res) => {
  try {
    const players = await Player.find();
    res.json(players);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar datos del jugador
exports.updatePlayer = async (req, res) => {
  try {
    const updated = await Player.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

