const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");
const path = require("path");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

let connectedClient = null;

wss.on("connection", (ws) => {
  console.log("✅ ESP32 connected via WebSocket");
  connectedClient = ws;

  ws.on("close", () => {
    console.log("❌ ESP32 disconnected");
    connectedClient = null;
  });
});

app.get("/send/:command", (req, res) => {
  const command = req.params.command;
  if (connectedClient && connectedClient.readyState === WebSocket.OPEN) {
    connectedClient.send(command);
    res.send(`✅ Command sent: ${command}`);
  } else {
    res.status(400).send("❌ ESP32 not connected");
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
