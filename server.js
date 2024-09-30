const WebSocket = require("ws");

const wss = new WebSocket.Server({ host: "::", port: 6969 }, () => {
  console.log("WebSocket server started on ws://[::]:6969");
});

console.log("Starting");

const clients = new Map(); // Store connected clients and their usernames

wss.on("connection", function connection(ws) {
  let username = ""; // Variable to store the username of the connected client

  // Notify all clients that a new user has joined
  ws.on("message", function incoming(message) {
    // Check if this is the first message to set the username
    if (!username) {
      username = message; // Set the username on the first message
      console.log(`User set username: ${username}`);

      clients.set(ws, username); // Store the username with the corresponding WebSocket

      // Notify all clients that the new user has joined
      clients.forEach((name, client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(`${username} has joined the chat.`); // Send join notification only after username is set
        }
      });


      updateConnectedUsers();
      return;
    }


    console.log(`Received message from ${username}: ${message}`);
    const fullMessage = `${username}: ${message}`;

    // Broadcast the message to all connected clients
    clients.forEach((name, client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(fullMessage); // Send message to all clients except the sender
      }
    });
  });

  const address = ws._socket.remoteAddress; // Get the address of the client
  console.log(`New client connected from ${address}`);

  // When the client disconnects
  ws.on("close", function () {
    console.log(`Client from ${address} disconnected!`);

    // Notify all clients that a user has left
    clients.forEach((name, client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(`${username} has left the chat.`);
      }
    });

    // Remove the client from the Map when they disconnect
    clients.delete(ws);

    // Update connected users list
    updateConnectedUsers();
  });

  // Update connected users list function
  function updateConnectedUsers() {
    const userList = Array.from(clients.values()).filter(Boolean); // Get current usernames
    const userMessage = `Connected users: ${
      userList.length > 0 ? userList.join(", ") : "No users"
    }`;
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(userMessage); // Notify each client of the current user list
      }
    });
  }
});
