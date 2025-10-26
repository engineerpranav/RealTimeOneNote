  const express = require("express");
  const socket = require("socket.io");
  const { v4: uuidv4 } = require("uuid");

  const app = express();
  app.use(express.json());
  app.use(express.static("public"));

  let port = process.env.PORT || 5000;
  let server = app.listen(port, () => console.log("Listening on port " + port));

  let io = socket(server);

  // Socket rooms
      io.on("connection", (socket) => {
        socket.on("join-room", (roomId) => {
          
          socket.join(roomId)
             
        
      });
        socket.on("beginPath", (data) => io.to(data.roomId).emit("beginPath", data));
        socket.on("drawStroke", (data) => io.to(data.roomId).emit("drawStroke", data));
        socket.on("redoUndo", (data) => io.to(data.roomId).emit("redoUndo", data));
      });

  // Route to create a new room
  app.get("/create", (req, res) => {
    const roomId = uuidv4();
    res.json({ link: `${req.protocol}://${req.get("host")}/${roomId}` });
  });

  // Serve same HTML for each room
  app.get("/:roomId", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
  });
