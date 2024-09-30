document.addEventListener("DOMContentLoaded", function () {
  const socket = new WebSocket("ws://localhost:6969");

  const messageInput = document.getElementById("messageInput");
  const sendButton = document.getElementById("sendButton");
  const messageList = document.getElementById("messages");

  // disabling the send button until WebSocket is coneected
  sendButton.disabled = true;

  socket.onopen = function () {
    console.log("Connected to WebSocket server");
    // enabling the send button
    sendButton.disabled = false;
  };

  socket.onmessage = function (event) {
    const message = event.data;
    console.log("Received:", message);

    const listItem = document.createElement("li");
    listItem.textContent = message;
    messageList.appendChild(listItem);
  };

  sendButton.addEventListener("click", function () {
    const message = messageInput.value.trim(); // Trim whitespace
    console.log("Message Input Value:", message);
    console.log("WebSocket State:", socket.readyState);

    if (socket.readyState === WebSocket.OPEN && message) {
      socket.send(message); // Send message to server

      const listItem = document.createElement("li");
      listItem.textContent = "You: " + message; // Display your message
      messageList.appendChild(listItem);

      messageInput.value = ""; // Clear input field
    } else {
      console.log("WebSocket is not open or message is empty.");
    }
  });

  socket.onclose = function () {
    console.log("WebSocket connection closed");
    sendButton.disabled = true; // disable the button if it disconects
  };

  socket.onerror = function (error) {
    console.log("Websocket error:", error);
  };
});
