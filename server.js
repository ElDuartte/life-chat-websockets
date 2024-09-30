const WebSocket = require("ws");

const wss = new WebSocket.Server({ host: "::", port: 6969 }, () => {
  console.log("WebSocket server started on ws://[::]:6969");
});

console.log("Starting");

const clients = []; // Array to hold connected clients

wss.on("connection", function connection(ws) {
  clients.push(ws); // Add the new client to the clients array
  const address = ws._socket.remoteAddress; // Get the address of the client
  console.log(`New client connected from ${address}`);

  // When the server receives a message from this client
  ws.on("message", function incoming(message) {
    console.log(`Received message from ${address}: ${message}`);

    // Broadcast the message to all connected clients
    clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(`${address}: ${message}`); // Send message to all clients except the sender
      }
    });
  });

  // When the client disconnects
  ws.on("close", function () {
    console.log(`Client from ${address} disconnected!`);
    // Remove the client from the array when they disconnect
    const index = clients.indexOf(ws);
    if (index !== -1) {
      clients.splice(index, 1);
    }
  });

  console.log(`New client connected! in port: ${wss.address().port}`);
});
