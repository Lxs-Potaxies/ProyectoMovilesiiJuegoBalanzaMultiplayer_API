const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  players: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
    },
  ],
  round: {
    type: Number,
    default: 1,
  },
  status: {
    type: String,
    enum: ["waiting", "in_progress", "finished"],
    default: "waiting",
  },
  maxWeighings: {
    type: Number,
    default: 3,
  },
  currentTurn: {
    type: Number,
    default: 1,
  },
  objects: [
    {
      label: String,       // A, B, C, ...
      weight: Number,      // Peso real oculto
    },
  ],
  heavierObject: {
    type: String,          // Ejemplo: "E"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  currentPlayer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Player" 
  },
  maxPlayers: {
    type: Number,
    default: 2, // Máximo 2 jugadores
  },
});

// game.js (Backend) - Generar pesos aleatorios para los objetos
const generateRandomWeights = () => {
  let weights = [];
  for (let i = 0; i < 8; i++) {
    weights.push(Math.floor(Math.random() * (20 - 2 + 1)) + 2); // Genera peso entre 2 y 20 gramos
  }
  return weights;
};


// Pesada lógica
const conductWeighing = (group1, group2, generatedWeights) => {
  const weights1 = group1.map(index => generatedWeights[index]);
  const weights2 = group2.map(index => generatedWeights[index]);

  const totalWeight1 = weights1.reduce((acc, weight) => acc + weight, 0);
  const totalWeight2 = weights2.reduce((acc, weight) => acc + weight, 0);

  if (totalWeight1 > totalWeight2) {
    return group1; // El grupo 1 es más pesado
  } else if (totalWeight2 > totalWeight1) {
    return group2; // El grupo 2 es más pesado
  } else {
    return null; // Los grupos están equilibrados
  }
};

module.exports = mongoose.model("Game", gameSchema);
