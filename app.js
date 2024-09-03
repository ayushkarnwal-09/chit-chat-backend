const express = require("express");
const app = express();
const server = require("http").createServer(app);
require("dotenv").config();
const logger = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

// Middleware
app.use(express.json());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*", // Ideally replace "*" with your front-end's URL for security
  })
);

// Database connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Socket.IO setup
const io = require("socket.io")(server, {
  cors: {
    origin: "*", // Ideally replace "*" with your front-end's URL for security
    methods: ["GET", "POST"],
  },
});

global.socketio = io;

// const phoneNoToSocketIdMap = new Map();
// const socketidToPhoneNoMap = new Map();

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on("sendMessage", (obj) => {
    socket.broadcast.emit("receiveMessage", obj);
  });

  // Example: Event handling
  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// Server listen
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
