// server.js
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let currentChar = "a";

wss.on("connection", (ws) => {
  console.log("ESP32 connected via WebSocket");

  // Delay the first message to allow ESP32 to get ready
  setTimeout(() => {
    ws.send(currentChar);
    console.log("Sent to ESP:", currentChar);
  }, 1000);

  ws.on("message", (message) => {
    console.log("Received from ESP:", message.toString());

    // Increment the character
    if (currentChar < "z") {
      currentChar = String.fromCharCode(currentChar.charCodeAt(0) + 1);
      ws.send(currentChar);
      console.log("Sent to ESP:", currentChar);
    } else {
      console.log("Reached z. Restarting...");
      currentChar = "a";
      ws.send(currentChar);
    }
  });

  ws.on("close", () => {
    console.log("ESP32 disconnected");
  });
});

app.get("/", (req, res) => {
  res.send("WebSocket server running!");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
