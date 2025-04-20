const Game = require("../models/Game");
const Player = require("../models/Player");

// Función para crear pesos aleatorios
const generateRandomObjects = () => {
  const labels = ["A","B","C","D","E","F","G","H","I","J"];
  const objects = labels.slice(0, 8).map(label => ({
    label,
    weight: Math.floor(Math.random() * 19) + 2, // 2 a 20g
  }));

  const heavierIndex = Math.floor(Math.random() * objects.length);
  const heavierObject = objects[heavierIndex].label;

  return { objects, heavierObject };
};

// Crear nueva partida
exports.createGame = async (req, res) => {
  try {
    const { players } = req.body;

    const { objects, heavierObject } = generateRandomObjects();

    const game = new Game({
      players,
      objects,
      heavierObject,
      status: "in_progress",
    });

    await game.save();

    res.status(201).json(game);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Obtener juegos existentes
exports.getAllGames = async (req, res) => {
  try {
    const games = await Game.find().populate("players");
    res.json(games);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
