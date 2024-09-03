const WebSocket = require("ws");

const wss = new WebSocket.Server({ host: "::", port: 6969 }, () => {
  console.log("WebSocket server started on ws://[::]:6969");
});

console.log("Starting");

wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(message) {
    console.log(message + " ");
  });

  ws.on("close", function () {
    console.log("closed!");
  });

  console.log("New client connected!");
});
