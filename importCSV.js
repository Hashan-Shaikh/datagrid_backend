const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const carData = require('./model/carSchema'); 

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

const importData = async () => {
    await connectDB();

    const results = [];
    fs.createReadStream('./bmwData.csv') 
        .pipe(csv())
        .on('data', (row) => {
            if (row.FastCharge_KmH === "-") {
                row.FastCharge_KmH = null; // Replace "-" with null
            } else {
                row.FastCharge_KmH = parseInt(row.FastCharge_KmH, 10) || null; // Convert to number or null
            }
            results.push(row);
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
