import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { io } from "socket.io-client";
import { Container, Typography, Button, TextField, Stack } from "@mui/material";

function App() {
  const socket = useMemo(() => io("http://localhost:5000"), []);
  // const socket = useMemo(
  //   () => io("https://jdfpt3qb-5000.inc1.devtunnels.ms/"),
  //   []
  // );

  const [msg, setMsg] = useState("");
  const [userId, setUserId] = useState("");
  const [socketId, setSocketId] = useState("");
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState("");

  useEffect(() => {
    socket.on("connect", () => setSocketId(socket.id));
    socket.on("welcome", (s) => console.log(s));

    return () => socket.disconnect();
  }, [socket]);

  socket.on("message-recieved", (data) => {
    if (socketId != data.user) {
      setMessages([...messages, { user: data.user, msg: data.msg }]);
    } else {
      setMessages([...messages]);
    }
    console.log(data);
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { msg, userId });
    setMessages([...messages, { user: "ME", msg }]);
    setMsg("");
    // setUserId("");
  };

  const handleRoom = (e) => {
    e.preventDefault();
    socket.emit("room-join", room);
    setUserId(room);
    setRoom("");
  };

  return (
    <>
      <Container maxWidth="sm">
        <Typography variant="h6" component="div" gutterBottom>
          Welcome to Socket.io test
        </Typography>
        <Typography variant="h6" component="div" gutterBottom>
          {socketId}
        </Typography>
        <form onSubmit={handleRoom}>
          <TextField
            id="outlined-basic"
            value={room}
            label="Room id"
            variant="outlined"
            onChange={(e) => setRoom(e.target.value)}
          />

          <Button type="submit" variant="contained" color="primary">
            Join
          </Button>
        </form>
        <Stack>
          {messages.map(({ user, msg }, i) => {
            return (
              <div key={i} style={{ display: "flex" }}>
                <p>{user}</p>
                <p>={">   "}</p>
                <p> {msg}</p>
              </div>
            );
          })}
        </Stack>

        <form onSubmit={handleSubmit}>
          <TextField
            id="outlined-basic"
            value={userId}
            label="User id"
            variant="outlined"
            onChange={(e) => setUserId(e.target.value)}
          />
          <TextField
            id="outlined-basic"
            value={msg}
            label="Message"
            variant="outlined"
            onChange={(e) => setMsg(e.target.value)}
          />
          <Button type="submit" variant="contained" color="primary">
            send
          </Button>
        </form>
      </Container>
    </>
  );
}

export default App;
