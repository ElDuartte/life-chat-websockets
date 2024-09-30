document.addEventListener("DOMContentLoaded", function () {
  let socket;
  const usernameInput = document.getElementById("usernameInput");
  const connectButton = document.getElementById("connectButton");
  const messageInput = document.getElementById("messageInput");
  const sendButton = document.getElementById("sendButton");
  const messageList = document.getElementById("messages");
  const connectedUsers = document.getElementById("connectedUsers");

  let currentUsername = "";
  let isUsernameSet = false;

  function initializeWebSocket() {
    socket = new WebSocket("ws://localhost:6969");

    socket.onopen = function () {
      console.log("Connected to WebSocket server");
    };

    socket.onmessage = function (event) {
      const message = event.data;
      console.log("Received:", message);
      const listItem = document.createElement("li");
      listItem.textContent = message;
      messageList.appendChild(listItem);

      // Scroll to the bottom of the message list when a new message is added
      messageList.scrollTop = messageList.scrollHeight;
    };

    socket.onclose = function () {
      console.log("WebSocket connection closed");
      sendButton.disabled = true; // Disable send button when connection is closed
      connectButton.textContent = "Connect"; // Reset the connect button
      connectButton.classList.remove("change-username"); // Remove change-username class
      connectButton.classList.add("connect"); // Add connect class back
      usernameInput.disabled = false; // Re-enable username input
      connectedUsers.textContent = ""; // Clear connected user display
      isUsernameSet = false; // Reset username flag
    };

    // Handle errors
    socket.onerror = function (error) {
      console.log("WebSocket error:", error);
    };
  }

  // Initialize the WebSocket when the page loads
  initializeWebSocket();

  connectButton.addEventListener("click", function () {
    if (!isUsernameSet) {
      const username = usernameInput.value.trim();
      if (username) {
        // Send username to server
        socket.send(username);
        currentUsername = username; // Store the current username
        isUsernameSet = true;
        connectButton.textContent = "Change Username"; // Change button to Change Username
        connectButton.classList.remove("connect"); // Remove connect class
        connectButton.setAttribute("id", "change-username"); // Add change-username class
        sendButton.disabled = false; // Enable the send button
        connectedUsers.textContent = `Connected as: ${currentUsername}`; // Display connected user
      } else {
        alert("Please enter a username.");
      }
    } else {
      const newUsername = usernameInput.value.trim();
      if (newUsername && newUsername !== currentUsername) {
        // Inform others that the user has changed their username
        const usernameChangeMessage = `${currentUsername} is now ${newUsername}`;
        socket.send(usernameChangeMessage);

        currentUsername = newUsername; // Update the current username
        connectedUsers.textContent = `Connected as: ${currentUsername}`; // Update displayed username
      } else {
        alert("Please enter a different username.");
      }
    }
  });

  // Initially set the button class to connect
  connectButton.classList.add("connect");

  sendButton.addEventListener("click", function () {
    const message = messageInput.value.trim();
    // Check if the socket is OPEN before sending
    if (socket.readyState === WebSocket.OPEN && message) {
      socket.send(message);

      const listItem = document.createElement("li");
      listItem.textContent = `${currentUsername}: ${message}`;
      messageList.appendChild(listItem);

      messageInput.value = "";
    } else {
      console.log("WebSocket is not open or message is empty.");
    }
  });
});
