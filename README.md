# 🎮 Real-Time Multiplayer Tic-Tac-Toe

A full-stack, real-time multiplayer game built with the **MERN Stack** (MongoDB, Express, React, Node.js) and **Socket.io**.

This application moves beyond simple HTTP polling, implementing a bidirectional WebSocket connection to ensure instant game state synchronization across different client devices. It handles complex concurrency issues, game state management, and robust error handling.

---

## 🚀 Key Features

* **Real-Time Gameplay:** Utilizes **Socket.io** to push game updates instantly to clients without page refreshes or resource-heavy polling.
* **Room-Based Matchmaking:** Users can create unique game rooms and invite friends via code sharing.
* **Concurrency Control:** Implemented server-side logic to prevent **Race Conditions** (e.g., two players moving simultaneously) using atomic database checks.
* **Data Persistence:** Game history, player turns, and board state are stored reliably in **MongoDB**.
* **Resilient State Management:** Clients automatically sync with the latest server state upon reconnection (handling page refreshes or network drops).
* **Responsive UI:** A clean, dark-mode interface built with React and raw CSS for accessibility and visibility.

---

## 🛠️ Tech Stack

### Frontend
* **React.js (Vite):** Fast, component-based UI.
* **Socket.io-Client:** For listening to real-time events (`receive_move`, `join_room`).
* **React Router:** For seamless navigation between Lobby and Game Room.

### Backend
* **Node.js & Express:** Scalable REST API and WebSocket server.
* **Socket.io:** Handles the handshake, event broadcasting, and room management.
* **MongoDB & Mongoose:** Schema-based NoSQL database for flexible game state storage.
* **CORS:** Configured for secure cross-origin resource sharing.

---

## 📐 System Architecture

1.  **Initialization:** The client connects via HTTP to create a game session in MongoDB.
2.  **Upgrade:** Upon entering the room, the HTTP connection is upgraded to a persistent **WebSocket (TCP)** connection.
3.  **Gameplay Loop:**
    * Player clicks a square → Emits `send_move` event.
    * **Server Validation:** Checks turn order, square availability, and game status.
    * **Atomic Update:** Updates MongoDB with `markModified` to ensure array consistency.
    * **Broadcast:** Emits `receive_move` to all clients in the specific `gameId` room.
4.  **Synchronization:** Clients receive the payload and update the React state instantly.

---

## 🔧 Installation & Setup

Follow these steps to run the project locally.

### Prerequisites
* Node.js (v14 or higher)
* MongoDB URI (Local or Atlas)

### 1. Clone the Repository
```bash
git clone [https://github.com/YOUR_USERNAME/tic-tac-toe-live.git](https://github.com/YOUR_USERNAME/tic-tac-toe-live.git)
cd tic-tac-toe-live
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create a .env file in the backend folder
echo "PORT=5000" > .env
echo "MONGO_URI=your_mongodb_connection_string" >> .env

# Start the Server
npm run dev
```

### 3. Frontend Setup
```bash
# Open a new terminal
cd frontend
npm install

# Create a .env file (Optional for local, required for deploy)
# echo "VITE_API_URL=http://localhost:5000" > .env

# Start the Client
npm run dev
```

## Project Structure
```text
tic-tac-toe-live/
├── backend/
│   ├── controllers/   # Game logic (Validation, Win Checks)
│   ├── models/        # Mongoose Schema (Game State)
│   ├── routes/        # API Endpoints
│   └── server.js      # Entry point (Socket.io + Express config)
│
└── frontend/
    ├── src/
    │   ├── pages/     # Home.jsx (Lobby), Game.jsx (Board)
    │   └── App.jsx    # Routing
    └── vite.config.js
```
