require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.warn('⚠️ MONGODB_URI is not defined in .env file');
}

mongoose.connect(MONGODB_URI || 'mongodb://localhost:27017/assignment', {
    serverSelectionTimeoutMS: 5000 // Fail after 5 seconds if cannot connect
})
    .then(() => console.log('✅ MongoDB connected successfully'))
    .catch(err => {
        console.error('❌ MongoDB connection error:', err.message);
        // Do not exit process, let nodemon restart
    });

// Routes
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const requestRoutes = require('./routes/requests');

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/requests', requestRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
