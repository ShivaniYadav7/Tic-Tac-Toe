const express = require('express');
const dotenv = require('dotenv');

const cors = require('cors');

// Load env vars
dotenv.config();

const mongoose = require('mongoose');


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:',err));

const gameRoutes = require('./routes/gameRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// 
app.use(cors());

// Middleware
app.use(express.json());

// Basic Route
app.get('/',(req,res) => {
    res.send('API is running...');
});

app.use('/api/game',gameRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});