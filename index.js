const mongoose = require('mongoose');
const express = require('express');
const carRoute = require('./routes/carRoute');
const cors = require('cors');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/csvdata', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

connectDB();

const app = express();
app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:3001" }));

app.use('/cars', carRoute);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

