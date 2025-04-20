const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,  // El nombre es obligatorio
  },
  group: {
    type: String,
    default: "A",  // Valor predeterminado
  },
  turn: {
    type: Number,
    default: 1,  // Valor predeterminado
  },
  isEliminated: {
    type: Boolean,
    default: false,
  },
  score: {
    type: Number,
    default: 0,
  },
  
});

module.exports = mongoose.model("Player", playerSchema);
