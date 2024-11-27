const fs = require('fs');
const path = require('path');
const { importData } = require('./importCsv');

//fetch dump file name from environment
const DUMP_FILE_NAME = process.env.DUMP_FILE;

// function checks if dump file not exists it calls importData function:
//     - which do data pre-processing 
//     - migrate all the data to db
//     - generate a dump file so that next time db state is known
const initializeApp = async () => {
    const dumpFilePath = path.join(__dirname, '..', DUMP_FILE_NAME);
    if (fs.existsSync(dumpFilePath)) {
        console.log('Dump file exists. Skipping import.');
    } else {
        console.log('Dump file does not exist. Running importCsv...');
        try {
            await importData();
            console.log('Import completed.');
        } catch (error) {
            console.error('Error during import:', error);
            process.exit(1);
        }
    }
};

module.exports = initializeApp;
