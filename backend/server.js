const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mkwise_financial';

console.log('Connecting to:', MONGODB_URI.split('@').length > 1
    ? MONGODB_URI.replace(/:([^:@]+)@/, ':****@')
    : MONGODB_URI);

mongoose.connect(MONGODB_URI)
    .then(() => console.log('Successfully connected to MongoDB'))
    .catch(err => {
        console.error('MongoDB connection error:', err.message);
        if (err.message.includes('ECONNREFUSED')) {
            console.error('ERROR: Could not connect to local database. Is MongoDB running locally?');
        } else if (err.message.includes('timeout')) {
            console.error('ERROR: Connection timed out. Please check your Atlas IP Whitelist/Network Access.');
        }
    });

// Routes
app.get('/', (req, res) => {
    res.send('Mkwise Financial API is running...');
});

// Import and use routes
app.use('/api/contact', require('./routes/contactForm.routes'));
app.use('/api/chatbot', require('./routes/chatbot.routes'));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
