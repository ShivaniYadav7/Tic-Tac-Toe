import {useState, useEffect} from 'react';
import { useParams} from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');

const Game = () => {
    const {gameId} = useParams();
    const [game, setGame] = useState(null);
    const [msg, setMsg] = useState("");

    const myUsername = localStorage.getItem("username");

    useEffect(() => {
        if(!myUsername) {
            window.location.href = "/";
            return;
        }

        const fetchGame = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/game/${gameId}`);
                const data = await res.json();
                if(res.ok){
                    setGame(data);
                }
            } catch (error) {
                console.error("Polling Error", error);
            }
        };

        fetchGame();
        
       //Socket: Join the room
       socket.emit('join_room',gameId);

       socket.on('receive_move', (updatedGame) => {
        console.log('Receive Move via Socket!');
        setGame(updatedGame);
       });

       return () => {
        socket.off('receive_move');
       };
    },[gameId,myUsername]);

    const handleCellClick = async (index) => {
        if(!game)return;
        if(game.status === 'finished')return;
        // if(!myUsername) return alert("Please confirm your name first!");

        const mySymbol = game.players.playerX === myUsername ? 'X' : 'O';

        socket.emit('send_move', {
            gameId, 
            index,
            player: mySymbol
        });
    };

    // ... inside Game.jsx ...

    if (!game) return <div> Loading Game Room...</div>;

    return (
        <div style={{textAlign: "center", marginTop: "20px"}}>
            <h1>Room Code: {gameId}</h1>
            
            {/* DEBUG: This proves the data exists. If you see "X" here, the backend is perfect. */}
            <div style={{background: '#333', color: '#fff', padding: '10px', margin: '10px'}}>
                DEBUG DATA: {JSON.stringify(game.board)}
            </div>

            <div style={{ marginBottom: "20px"}}>
                <p>Status: <strong>{game.status}</strong></p>
                <p>Current Turn: <strong>Player {game.turn}</strong></p>
                {msg && <div style={{color: "red", fontWeight: "bold"}}>{msg}</div>}
            </div>

            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 100px)",
                gap: "10px",
                justifyContent: "center"
            }}>
                {game.board.map((cell, idx) => (
                    <div 
                        key={idx}
                        onClick={() => handleCellClick(idx)}
                        style={{
                            width: "100px",
                            height: "100px",
                            backgroundColor: "#f0f0f0", 
                            
                            // 🛑 THE FIXES ARE HERE:
                            color: "red",               // Force text to RED (High Contrast)
                            display: "flex",
                            alignItems: "center",       // Fixed spelling (was alginItems)
                            justifyContent: "center",
                            
                            fontSize: "40px",
                            fontWeight: "bold",
                            cursor: "pointer",
                            border: "2px solid #333"
                        }}
                    >
                        {/* If cell is null/empty, render a space to keep height */}
                        {cell || "\u00A0"} 
                    </div>
                ))}
            </div>

            <div style={{ marginTop: "20px"}}>
                <p>Player X: {game.players.playerX}</p>
                <p>Player O: {game.players.playerO || "Waiting..."}</p>
            </div>
        </div>
    );
};

export default Game;