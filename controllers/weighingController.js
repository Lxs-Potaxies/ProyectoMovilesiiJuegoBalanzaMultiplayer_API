const Weighing = require("../models/Weighing");
const Game = require("../models/Game");

// Función para calcular el resultado de la balanza
const compareWeights = (objects, leftPan, rightPan) => {
  const leftWeight = leftPan.reduce((total, label) => {
    const obj = objects.find(o => o.label === label);
    return total + (obj?.weight || 0);
  }, 0);

  const rightWeight = rightPan.reduce((total, label) => {
    const obj = objects.find(o => o.label === label);
    return total + (obj?.weight || 0);
  }, 0);

  if (leftWeight > rightWeight) return ">";
  if (leftWeight < rightWeight) return "<";
  return "=";
};

// Crear una nueva pesada
exports.createWeighing = async (req, res) => {
  try {
    const { gameId, playerId, leftPan, rightPan } = req.body;

    const game = await Game.findById(gameId);
    if (!game) throw new Error("Juego no encontrado");

    const turnNumber = game.currentTurn;

    const result = compareWeights(game.objects, leftPan, rightPan);

    const weighing = new Weighing({
      game: gameId,
      player: playerId,
      turnNumber,
      leftPan,
      rightPan,
      result,
    });

    await weighing.save();

    // Aquí podrías aumentar el turno o verificar si alcanzó el límite de pesadas
    game.currentTurn += 1;
    await game.save();

    res.status(201).json({ weighing, result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Obtener todas las pesadas de un juego
exports.getWeighingsByGame = async (req, res) => {
  try {
    const { gameId } = req.params;

    const weighings = await Weighing.find({ game: gameId }).populate("player");

    res.json(weighings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createWeighing = async (req, res, io) => {
  try {
    const { gameId, playerId, leftPan, rightPan } = req.body;

    const game = await Game.findById(gameId);
    if (!game) throw new Error("Juego no encontrado");

    const existingWeighings = await Weighing.find({ game: gameId, player: playerId });
    if (existingWeighings.length >= 3) {
      return res.status(403).json({ error: "Límite de pesadas alcanzado para este jugador." });
    }

    const turnNumber = game.currentTurn;
    const result = compareWeights(game.objects, leftPan, rightPan);

    const weighing = new Weighing({
      game: gameId,
      player: playerId,
      turnNumber,
      leftPan,
      rightPan,
      result,
    });

    await weighing.save();

    game.currentTurn += 1;
    await game.save();

    // 👇 Emitimos evento a todos los clientes conectados
    io.emit("new-weighing", {
      gameId,
      playerId,
      turnNumber,
      leftPan,
      rightPan,
      result
    });

    res.status(201).json({ weighing, result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
