import { useNavigate } from "react-router-dom";
import { useState} from "react";

export default function Home() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [gameId, setGameId] = useState("");

    async function handleJoin() {
        if(!gameId || !username) return alert("Please enter your Name and GameID");

        try {
            const res = await fetch("http://localhost:5000/api/game/join",{
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({gameId,username})
            });

            const data = await res.json();

            if(res.ok) {
                localStorage.setItem("username", username);
                navigate(`/game/${data.gameId || gameId}`);
            } else {
                alert("Error: " + data.message);
            }
        } catch (err) {
            console.error("Error:",err);
        }
    }

    async function handleCreate() {
        if(!username) return alert("Please enter a Name");

        try {
            const res = await fetch("http://localhost:5000/api/game/start",{
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({username})
        });
        
        const data = await res.json();

        if(res.ok) {
            localStorage.setItem("username", username);
            navigate(`/game/${data.gameId || gameId}`);
        } else {
            alert("Error:" + data.message);
        } 
    }
    catch(err){
        console.error("Error:",err);
    }
}

    return (
        <div style={{textAlign: "center"}}>
            <h1> Welcome!</h1>

            <div>
                <input placeholder="Enter your name" value = {username} onChange={(e) => setUsername(e.target.value)}/>
            </div>
            <br/> 
                <button onClick={handleCreate}>Create New Game</button>

            <h3>OR</h3>                       

            <div>
                <input placeholder="Enter Game ID" value = {gameId} onChange={(e) => setGameId(e.target.value)} />
                <button onClick={handleJoin}> Join Game</button>
            </div>
            
        </div>
    )
}