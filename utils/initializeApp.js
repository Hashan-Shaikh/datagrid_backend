const fs = require('fs');
const path = require('path');
const { importData } = require('./importCsv');
const validateSchemasWithHash = require('./hash');

// function tasks:
// - look for dump file
// - call hash function to calculate hash of dumpfile and newly uploaded csv file
// - if hashes are same and dumpfile is found skip dbMigration
// - else call importData function
const initializeApp = async () => {
    const dumpFilePath = path.join(__dirname, '..', process.env.DUMP_FILE);
    const matcher = await validateSchemasWithHash()
    if (matcher && fs.existsSync(dumpFilePath)) {
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
