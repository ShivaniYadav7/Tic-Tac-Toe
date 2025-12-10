const express = require("express");
const router = express.Router();
const { createGame, joinGame, makeMove,getGame} = require("../controllers/gameController.js");

router.post('/start',createGame);
router.post('/join', joinGame);
router.post('/move',makeMove);
router.get('/:gameId', getGame);

module.exports = router;

