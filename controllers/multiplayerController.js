const { v4: uuidv4 } = require("uuid");

let multiplayerSessions = [];

exports.createSession = (req, res) => {
  const { players } = req.body;

  if (!players || players.length !== 10) {
    return res.status(400).json({ error: "Se requieren exactamente 10 jugadores." });
  }

  const sessionId = uuidv4();

  const session = {
    sessionId,
    createdAt: new Date(),
    players: players.map((p) => ({
      id: p.id,
      name: p.name,
      group: p.group,
      eliminated: false,
    })),
    moves: [],
    finalInputs: [],
  };

  multiplayerSessions.push(session);

  return res.status(201).json({ sessionId });
};

exports.registerMove = (req, res) => {
  const { sessionId, playerId, action } = req.body;

  const session = multiplayerSessions.find((s) => s.sessionId === sessionId);
  if (!session) return res.status(404).json({ error: "Sesión no encontrada" });

  session.moves.push({
    playerId,
    action,
    timestamp: new Date(),
  });

  return res.status(200).json({ message: "Movimiento registrado" });
};

exports.finalizeSession = (req, res) => {
  const { sessionId, inputs } = req.body;

  const session = multiplayerSessions.find((s) => s.sessionId === sessionId);
  if (!session) return res.status(404).json({ error: "Sesión no encontrada" });

  session.finalInputs = inputs;

  return res.status(200).json({ message: "Datos finales registrados" });
};

exports.getSession = (req, res) => {
  const { sessionId } = req.params;

  const session = multiplayerSessions.find((s) => s.sessionId === sessionId);
  if (!session) return res.status(404).json({ error: "Sesión no encontrada" });

  return res.status(200).json(session);
};
