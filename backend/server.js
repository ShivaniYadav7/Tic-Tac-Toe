const express = require('express');
const dotenv = require('dotenv');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

// Load env vars
dotenv.config();

const mongoose = require('mongoose');


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:',err));

const gameRoutes = require('./routes/gameRoutes');
const Game = require('./models/Game');
const { checkWinner } = require('./controllers/gameController');

const app = express();
const PORT = process.env.PORT || 5000;

// 
app.use(cors());

// Middleware
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Basic Route
// app.get('/',(req,res) => {
//     res.send('API is running...');
// });

app.use('/api/game',gameRoutes);

io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on('join_room', async (gameId) => {
        socket.join(gameId);
        console.log(`User ${socket.id} joined room: ${gameId}`);

        try {
            const game = await Game.findOne({ gameId });
            if(game) {
                io.to(gameId).emit('receive_move', game);
            }
        } catch (err) {
            console.error(err);
        }
    });

    socket.on('send_move', async (data) => {
        const { gameId, index, player } = data;

        // Debug Log: PRove the server received click

        const game = await Game.findOne({ gameId});
        // Check existence
        if(!game || game.status == 'finished')return;

        if(game.turn !== player) return;
        if(game.board[index] !== "" && game.board[index] !== null ){
            console.log("Square occupied");
            return;
        }

        game.board[index] = player;

        const winner = checkWinner(game.board);

        if(winner) {
            game.winner = winner;
            game.status = "finished";

        }
        else if(!game.board.includes("") && !game.board.includes(null)){
            game.winner = "draw";
            game.status = "finished";
        }
        else{
            game.turn = player === 'X' ? 'O' : 'X';
        }

        game.markModified('board');

        await game.save();
        
        io.to(gameId).emit('receive_move',game);
    });

    socket.on('disconnect',() => {
        console.log('User Disconnected',socket.id);
    });
});


server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});