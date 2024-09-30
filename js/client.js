document.addEventListener("DOMContentLoaded", function () {
  const socket = new WebSocket("ws://localhost:6969");

  const messageInput = document.getElementById("messageInput");
  const sendButton = document.getElementById("sendButton");
  const messageList = document.getElementById("messages");

  sendButton.disabled = true; // Initially disable the send button

  // Log when the connection is opened
  socket.onopen = function () {
    console.log("Connected to WebSocket server");
    sendButton.disabled = false; // Enable send button when connected
  };

  // Log incoming messages
  socket.onmessage = function (event) {
    const message = event.data;
    console.log("Received:", message); // Log received messages
    const listItem = document.createElement("li");
    listItem.textContent = message; // Display the received message
    messageList.appendChild(listItem);
  };

  // Handle the send button click
  sendButton.addEventListener("click", function () {
    const message = messageInput.value.trim(); // Trim whitespace
    console.log("Message Input Value:", message); // Log the input value
    console.log("WebSocket State:", socket.readyState); // Log WebSocket state

    if (socket.readyState === WebSocket.OPEN && message) {
      socket.send(message); // Send message to server

      const listItem = document.createElement("li");
      listItem.textContent = "You: " + message; // Display your own message
      messageList.appendChild(listItem);

      messageInput.value = ""; // Clear input field
    } else {
      console.log("WebSocket is not open or message is empty.");
    }
  });

  // Handle connection close
  socket.onclose = function () {
    console.log("WebSocket connection closed");
    sendButton.disabled = true; // Disable send button on close
  };

  // Handle errors
  socket.onerror = function (error) {
    console.log("WebSocket error:", error);
  };
});
