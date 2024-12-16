const express = require("express");
const app = express();
const { Server } = require("socket.io");
const { createServer } = require("http");
const cors = require("cors");
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  })
);
port = 5000;

const httpServer = new createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("connection is established", socket.id);

  socket.emit("welcome", ` =>SERVER<=`);

  socket.on("message", (data) => {
    console.log("message recieved", data);
    // socket.broadcast.emit("message-recieved", data);
    io.to(data.userId).emit("message-recieved", {
      user: socket.id,
      msg: data.msg,
    });
  });

  socket.broadcast.emit("welcome", ` =>${socket.id}<=  came online`);
  socket.on("room-join", (room) => {
    socket.join(room);
  });

  socket.on("disconnect", (msg) => console.log("disconnected", socket.id, msg));
});

httpServer.listen(port, () => {
  console.log(`server is running on ${port}`);
});
