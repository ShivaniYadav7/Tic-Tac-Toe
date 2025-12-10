const Game = require('../models/Game');
const crypto = require('crypto');


exports.createGame = async (req,res) => {
    try{
        // Generate a short 4-charater Room ID
        const roomId = crypto.randomBytes(2).toString('hex');

        // Identify Player 1
        const playerX_ID = req.body.username || "Player 1";

        // The DATABASE entry
            const newGame = await Game.create({
                gameId: roomId,
                players: {
                playerX: playerX_ID,
                playerO: null
            },
                status: 'waiting'
            });

        res.status(201).json(newGame);
    } catch(error){
        console.error("Create game error:",error);
        res.status(500).json({message: "Server Error",error: error.message});
    }
};

exports.joinGame = async (req,res) => {
    try {
        const {gameId, username} = req.body;

        // Find the game
        const game =await Game.findOne({gameId});

        if(!game){
            return res.status(404).json({message: "Game not found"});
        }

        // Update the Game State
        if(game.players.playerO){
            return res.status(400).json({message: "Game is already full"});
        }

        game.players.playerO = username || "Player 2";
        game.status = "active";

        await game.save();

        res.status(200).json(game);
    } catch (error) {
        res.status(500).json({message: "Server Error",error});
    }
};

exports.makeMove = async (req, res) => {
    try {
        const { gameId, index, player} = req.body;

        const game = await Game.findOne({gameId});

        if(!game)return res.status(404).json({message: "Game Not Found"});

        //VALIDATIONS 
        if(game.status === 'finished') {
            return res.status(400).json({message: "Game is finished"});
        }

        if(game.turn !== player) {
            return res.status(400).json({message: "Not your turn"});
        }

        if(game.board[index]){
            return res.status(400).json({message: "Square already marked"});
        }

        //UPDATE BOARD
        game.board[index] = player;

        //CHECK WINNER
        const winner = checkWinner(game.board);
        if(winner) {
            game.winner = winner;
            game.status = "finished";
        } else if(!game.board.includes(null)){
            game.winner = "draw";
            game.status = "finished";
        } else{
            game.turn = player === 'X' ? 'O' : 'X';
        }

        await game.save();
        res.status(200).json(game);
    } catch (error) {
        res.status(500).json({message: "Server Error",error});
    }
};

exports.getGame = async(req, res) => {
    try {
        const { gameId } = req.params;
        const game = await Game.findOne({gameId});

        if(!game){
            return res.status(404).json({message: "Game not found"});
        }
        res.status(200).json(game);
    } catch (error) {
        res.status(500).json({message: "Server Error",error: error.message});
    }
};

function checkWinner(board) {
    const winningCombos = [
        [0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8],[0,4,8],[2,4,6]
    ];

    for(let combo of winningCombos){
        const [a, b, c] = combo;
        if(board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null;
}