const express = require("express");
const router = express.Router();

const {
  createGame,
  getAllGames,
} = require("../controllers/gameController");

router.post("/", createGame);
router.get("/", getAllGames);

router.post('/:id/join', async (req, res) => {
  const { id } = req.params;
  const { playerId } = req.body;

  const game = await Game.findById(id);
  if (game.players.length >= game.maxPlayers) {
    return res.status(400).json({ error: "La partida está llena" });
  }

  game.players.push(playerId);
  if (!game.currentPlayer) game.currentPlayer = playerId; // Primer jugador inicia
  await game.save();

  res.json(game);
});

module.exports = router;
