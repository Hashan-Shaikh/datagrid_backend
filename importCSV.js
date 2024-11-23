const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const carData = require('./models/carSchema');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Read the CSV file path from the environment variable
const csvFilePath = process.env.CSV_FILE_PATH;

if (!csvFilePath) {
    console.error('Error: CSV_FILE_PATH is not defined in the environment variables.');
    process.exit(1);
}

const connectDB = async () => {
    await mongoose.connect('mongodb://localhost:27017/csvdata', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');
};

const disconnectDB = async () => {
    await mongoose.disconnect();
    console.log('MongoDB Disconnected...');
};

const cleanRow = (row) => {
    for (const key in row) {
        const value = row[key];

        if(value === '-'){
            row[key] = null; // if "-" so replace it with null
        }
        else{
            row[key] = value.trim().replace(/\s+/g, " "); // Trim and remove extra spaces
        }
    }
    return row;
};

const importData = async () => {
    await connectDB();

    const results = [];
    fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (row) => {
            results.push(cleanRow(row)); // Clean each row
        })
        .on('end', async () => {
            try {
                await carData.insertMany(results);
                console.log('CSV data imported successfully!');
            } catch (err) {
                console.error('Error importing data:', err);
            } finally {
                await disconnectDB();
                process.exit();
            }
        });
};

importData();
