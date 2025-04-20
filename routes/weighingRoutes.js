const express = require("express");
const weighingController = require("../controllers/weighingController");

module.exports = (io) => {
  const router = express.Router();

  // 👇 Pasamos io al controlador
  router.post("/", (req, res) => weighingController.createWeighing(req, res, io));
  router.get("/:gameId", weighingController.getWeighingsByGame);

  return router;
};
