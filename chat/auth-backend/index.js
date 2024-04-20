

import express from "express"
import http from "http"
import { Server } from "socket.io"
import dotenv from "dotenv"
import authRouter from "./routes/auth.route.js"
import usersRouter from "./routes/user.route.js"
import connectToMongoDB from "./db/connectToMongoDB.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import e from "express"


dotenv.config();
const PORT = process.env.PORT || 5000;


const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
   credentials: true,
   origin: ['http://localhost:3000','http://localhost:3001']
}));
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        allowedHeaders: ["*"],
        origin: "*"
      }
 });

// user - socket 
// one to one messaging - sender and receiver

const userSocketMap = {};

io.on("connection", (socket) => {
   console.log('Client connected');
   const username = socket.handshake.query.username;
   console.log('Username:', username);

   userSocketMap[username] = socket;
   
   socket.on('chat msg', (msg) => {
    console.log(msg.sender);
    console.log(msg.receiver);
    console.log(msg.textMsg);
    console.log(msg);
    const receiverSocket = userSocketMap[msg.receiver];
    if(receiverSocket) {
        receiverSocket.emit('chat msg', msg.textMsg);
    }
    //socket.broadcast.emit('chat msg', msg.textMsg);
});

})


app.use(express.json()); // It parses the incoming request body, if any, and populates the req.body property with the parsed JSON data. This allows you to easily access the JSON data sent by clients in HTTP requests.


app.use('/auth', authRouter);
app.use('/users', usersRouter);

app.get('/', (req, res) => {
    res.send("Welcome to HHLD Chat App!");
 });
 
 
 app.listen(PORT, (req, res) => {
    connectToMongoDB();
    console.log(`Server is running at ${PORT}`);
 })
 