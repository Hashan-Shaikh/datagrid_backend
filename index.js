const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const initializeApp = require('./utils/initializeApp');
const routes = require('./routes');
const path = require('path');

dotenv.config(); // Load environment variables

const app = express();

// Middlewares
app.use(express.json());
//app.use('/upload', express.static(path.join(__dirname, 'data')));
app.use(cors({ credentials: true, origin: `http://localhost:${process.env.FRONTEND_PORT}` }));

// Connect to Database and if success so run initializeApp function
connectDB().then(async () => {
    //await initializeApp();
});

// Routes
app.use('/', routes);

// Start the server
const PORT = process.env.BACKEND_PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
