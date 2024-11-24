const mongoose = require('mongoose');
const express = require('express');
const dynamicRoute = require('./routes/dynamicRoute');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const {importData} = require('./importCsv');
const dotenv = require('dotenv');

dotenv.config();

const DUMP_FILE_NAME = process.env.DUMP_FILE;

const dumpFilePath = path.join(__dirname, DUMP_FILE_NAME);

//Function to handle schema and data import logic
const initializeApp = async () => {
    if (fs.existsSync(dumpFilePath)) {
        console.log('Dump file exists so dumped schema will be used later..');
    } else {
        console.log('Dump file does not exist. Running importCsv to create dump...');
        try {
            await importData(); // Run the importCsv function to parse the CSV and create dump
            console.log('Import completed.');
        } catch (error) {
            console.error('Error during import:', error);
            process.exit(1); // Exit if the import fails
        }
    }
};


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

connectDB().then(()=>{
    initializeApp();
})

const app = express();
app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:3001" }));

app.use('/dynamic', dynamicRoute);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

