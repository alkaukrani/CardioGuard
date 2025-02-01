// Import required dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Initialize express app
const app = express();

// Middleware
app.use(cors());  // Enable CORS for all routes
app.use(express.json());  // Parse JSON bodies

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
    serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
    }
}).then(() => {
    console.log("Connected to MongoDB successfully");
}).catch((err) => {
    console.error("MongoDB connection error:", err);
});

// Check database connection
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
    console.log("Connected to MongoDB successfully");
});

// Define User Schema
const userSchema = new mongoose.Schema({
    whoopId: String,
    firstName: String,
    lastName: String,
    age: Number,
    gender: String,
    familyHistory: String,
    healthMetrics: [{
        date: { type: Date, default: Date.now },
        cholesterolLDL: Number,
        cholesterolHDL: Number,
        bloodPressureSystolic: Number,
        bloodPressureDiastolic: Number,
        bloodSugar: Number,
        restingHeartRate: Number,
        smoking: Boolean,
        alcoholConsumption: String
    }]
});

// Create User model
const User = mongoose.model('User', userSchema);

// Routes

// Create new user
app.post('/api/users', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Add health metrics to existing user
app.post('/api/users', async (req, res) => {
    console.log('Received request body:', req.body); // Add this line
    try {
        const user = new User(req.body);
        await user.save();
        console.log('User saved successfully:', user); // Add this line
        res.status(201).json(user);
    } catch (error) {
        console.error('Error saving user:', error); // Add this line
        res.status(400).json({ error: error.message });
    }
});

// Get user profile
app.get('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Start server
// At the bottom of server.js
const PORT = 5001; // Change this line to explicitly use 5001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});