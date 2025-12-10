import {useState, useEffect} from 'react';
import { useParams} from 'react-router-dom';

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
        const interval = setInterval(fetchGame,1000);

        return () => clearInterval(interval);

    },[gameId,myUsername]);

    const handleCellClick = async (index) => {
        if(!game)return;
        if(game.status === 'finished')return;
        // if(!myUsername) return alert("Please confirm your name first!");

        const mySymbol = game.players.playerX === myUsername ? 'X' : 'O';

        try {
            const res = await fetch('http://localhost:5000/api/game/move', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    gameId,
                    index,
                    player: mySymbol
                })
            });

            const data = await res.json();
            if(!res.ok){
                setMsg(data.message);
                setTimeout(() => setMsg(""),2000);
            }
        } catch (error) {
            console.error("Move failed",error);
        }
    };

    // if(!myUsername){
    //     return (
    //         <div className="card">
    //             <h2>Security Check</h2>    
    //             <p>Please re-enter your name to play:</p>
    //             <input placeholder="Name used in lobby" id = "confirmName"/>
                
    //             <button onClick = { () => setMyUsername(document.getElementById("confirmName").value)}>Join Room</button>
    //         </div>
    //     );
    // }
    
    if (!game) return <div> Loading Game Room...</div>

    return (
        <div style={{textAlign: "center",marginTop: "20px"}}>
            <h1>Room Code: {gameId}</h1>

            <div style={{ marginBottom: "20px"}}>
                <p>Status: <strong>{game.status}</strong></p>
                <p>Current Turn: <strong>Player {game.turn}</strong></p>

                {msg && <div style={{color: "red", fontWeight: "bold"}}>{msg}</div>}

                {game.winner && (
                    <div style={{ color: "green", fontSize: "24px", fontWeight: "bold"}}>
                        {game.winner === 'draw' ? "It's a Draw!" : `Winner: ${game.winner}`}</div>
                )}
            </div>

            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,100px)",
                gap: "10px",
                justifyContent: "center"
            }}>
                {game.board.map((cell,idx) => (
                    <div 
                        key={idx}
                        onClick={() => handleCellClick(idx)}
                        style={{
                            width: "100px",
                            height: "100px",
                            display: "flex",
                            alginItems: "center",
                            fontSize: "40px",
                            fontWeight: "bold",
                            cursor: "pointer",
                            border: "2px solid #333"
                        }}>
                            {cell}
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