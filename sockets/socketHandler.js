module.exports = (io) => {
  let players = []; // Mantener el estado de los jugadores
  let generatedWeights = generateRandomWeights(); // Genera pesos aleatorios para los objetos

  // Cuando un jugador se conecta
  io.on("connection", (socket) => {
      console.log(`Jugador conectado: ${socket.id}`);

      // Agregar jugador a la lista de jugadores
      socket.on("join-game", (playerName) => {
          players.push({ id: socket.id, name: playerName });
          console.log(`${playerName} se unió al juego`);

          // Enviar mensaje a todos los jugadores (actualización de juego)
          io.emit("game-update", { message: `${playerName} se unió al juego.` });

          // Enviar estado al jugador recién unido
          socket.emit("player-status", "Esperando turno");
      });

      // Cuando un jugador realiza una pesada
      socket.on("make-weighing", (data) => {
          console.log(`Pesada realizada por ${data.playerId}`);

          // Lógica de pesada
          const group1 = data.weighingData.group1;
          const group2 = data.weighingData.group2;

          const result = conductWeighing(group1, group2, generatedWeights);

          // Enviar el resultado de la pesada al jugador (y otros si es necesario)
          if (result) {
              io.emit("game-update", { message: `Pesada completa. El grupo más pesado fue: ${result}` });
          } else {
              io.emit("game-update", { message: "Los grupos están equilibrados." });
          }

          // Cambiar el estado del jugador después de la pesada
          socket.emit("player-status", "Pesada realizada");
      });

      // Cuando un jugador hace clic para iniciar el juego
      socket.on("start-game", (data) => {
          console.log(`${data.playerId} ha iniciado el juego.`);

          // Aquí podrías agregar lógica para iniciar el juego, mostrar mensajes, etc.
          io.emit("game-update", { message: `${data.playerId} ha comenzado el juego` });

          // Actualizar el estado del jugador
          socket.emit("player-status", "Juego iniciado, espera tu turno.");
      });

      // Cuando un jugador se desconecta
      socket.on("disconnect", () => {
          const playerIndex = players.findIndex(player => player.id === socket.id);
          if (playerIndex !== -1) {
              console.log(`${players[playerIndex].name} se desconectó.`);
              players.splice(playerIndex, 1); // Eliminar al jugador de la lista
              io.emit("game-update", { message: `${players[playerIndex].name} se desconectó.` });
          }
      });
  });
};

// Función para realizar la pesada
function conductWeighing(group1, group2, generatedWeights) {
  const weight1 = group1.reduce((sum, obj) => sum + generatedWeights[obj], 0);
  const weight2 = group2.reduce((sum, obj) => sum + generatedWeights[obj], 0);
  if (weight1 > weight2) {
      return "Grupo 1";
  } else if (weight1 < weight2) {
      return "Grupo 2";
  } else {
      return null; // Los grupos están equilibrados
  }
}

// Función para generar pesos aleatorios entre 2 y 20 gramos
function generateRandomWeights() {
  const weights = {};
  for (let i = 1; i <= 12; i++) {  // Hasta 12 objetos
    weights[i] = Math.floor(Math.random() * 19) + 2; // Pesos aleatorios entre 2 y 20
  }
  return weights;
}

// Lógica de pesada (modificada)
function conductWeighing(group1, group2, generatedWeights) {
  const weight1 = group1.reduce((sum, obj) => sum + generatedWeights[obj], 0);
  const weight2 = group2.reduce((sum, obj) => sum + generatedWeights[obj], 0);
  
  if (weight1 > weight2) {
    return { result: "left", heavierGroup: group1 };
  } else if (weight1 < weight2) {
    return { result: "right", heavierGroup: group2 };
  } else {
    return { result: "equal", heavierGroup: [] };
  }
}

