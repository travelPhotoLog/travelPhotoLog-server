const socket = require("socket.io");

const server = server => {
  // const io = socket(server, {
  //   cors: { origin: "https://travel-photo-log.com" },
  // });

  const io = socket(server, { cors: { origin: "*" } });

  io.on("connection", socket => {
    socket.on("join", roomName => {
      socket.join(roomName);
    });

    socket.on("leave", roomName => {
      socket.leave(roomName);
    });

    socket.on("uploadSuccess", roomName => {
      io.to(roomName).emit("uploadSuccess");
    });
  });

  io.on("disconnection", reason => {
    console.log(reason);
  });
};

module.exports = server;
