const express = require("express");
const path = require("path");
const socket = require("socket.js");
const app = express();
const formatMessage = require("./utils/message");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/user");
const server = require("http").Server(app);
const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname, "public")));

// run when client connects
const chatBot = "OBOT";
io.on("connection", (socket) => {
  console.log("new WS Connection");
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);
    //Welcome current user
    socket.emit("message", formatMessage(chatBot, "Welcome to O Chat"));
    //Broadcast when a user connects
    io.to(user.room).emit(
      "message",
      formatMessage(chatBot, ` ${user.username} تحيه كبيره للراجل ال دخل ده `)
    );
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });
  // Listen for chatMessage
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    let valdiateMsg;
    // nowAloowedWords validation
    let notAllowedWord = ["pussy", "[object Object]", "sex", "shit"];
    const regex = new RegExp(`\\b(${notAllowedWord.join("|")})\\b`, "g");
    valdiateMsg = msg.replaceAll(regex, "Not allowed this word");

    console.log(valdiateMsg);
    io.to(user.room).emit("message", formatMessage(user.username, valdiateMsg));
  });
  //Run client disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(chatBot, ` ${user.username} تحيه كبيره للراجل ال خرج ده `)
      );
    }
  });
});
server.listen(3000, () => {
  console.log("server running ");
});
