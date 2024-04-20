import express from 'express'
import dotenv from 'dotenv'   
import http from 'http'
import { Server } from 'socket.io'; 

// dotenv library loads environment variables from .env file into process.env

dotenv.config();
const port = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        allowedHeaders: ['*'],
        origin: '*',
    },

}
);

io.on('connection', (socket) => {
    console.log('Client connected - started');
    socket.on('chat msg', (msg) => {
        console.log('Received msg ' + msg);
        socket.broadcast.emit('chat msg', msg);
        //io.emit('chat msg', msg);
        
    });
 });



// Define the route
app.get('/', (req, res) => {
     res.send('Anshika Ankur Chat for Sarafa Shop and Krishna will help!');
});

//start the server
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});