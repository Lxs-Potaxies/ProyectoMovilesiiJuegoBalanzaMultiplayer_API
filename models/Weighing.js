const mongoose = require("mongoose");

const weighingSchema = new mongoose.Schema({
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Game",
    required: true,
  },
  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Player",
    required: true,
  },
  turnNumber: Number,
  leftPan: [String], // Ej: ["A", "B", "C"]
  rightPan: [String], // Ej: ["D", "E", "F"]
  result: {
    type: String,
    enum: [">", "<", "="],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Weighing", weighingSchema);
