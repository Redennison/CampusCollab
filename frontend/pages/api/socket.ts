import { Server } from "socket.io"

export const config = {
  api: {
    bodyParser: false,
  },
}

export default function handler(req, res) {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server)
    res.socket.server.io = io

    io.on("connection", (socket) => {
      socket.on("joinRoom", (roomId) => socket.join(roomId))
      socket.on("sendMessage", async ({ roomId, message, from }) => {
        await fetch("http://localhost:8000/messages/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            match_id: roomId,
            sender_id: from,
            content: message,
          }),
        })
        io.to(roomId).emit("receiveMessage", {
          message,
          from,
          timestamp: Date.now(),
        })
      })
    })
  }
  res.end()
}