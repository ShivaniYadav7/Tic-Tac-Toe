const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    gameId: {
        type: String,
        unique: true,
        required: true
    },
    players: {
        playerX: { type: String,default: null},
        playerO: { type: String,default: null}
    },
    board: {
        type: [String],
        default: Array(9).fill(null)
    },
    turn: {
        type: String,
        enum: ['X','O'],
        default: 'X'
    },
    winner: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: ['waiting','active','finished'],
        default: 'waiting'
    }
},{ timestamps: true});

module.exports = mongoose.model('Game',gameSchema);