const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cleanData = require('./cleanData');
const createSchemaFromHeaders = require('./createSchemaFromHeaders');

dotenv.config();

const csvFilePath = process.env.CSV_FILE_PATH;

if (!csvFilePath) {
    console.error('Error: CSV_FILE_PATH is not defined in the environment variables.');
    process.exit(1);
}

const importData = async () => {

    const results = [];
    let headers = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on('headers', (csvHeaders) => {
                headers = csvHeaders;
            })
            .on('data', (row) => {
                results.push(cleanData(row));
            })
            .on('end', async () => {
                if (headers.length === 0) {
                    reject('No headers found in the CSV file.');
                    return;
                }

                const { schemaFields, schema } = createSchemaFromHeaders(headers);
                const DynamicModel = mongoose.model('dynamicData', schema);

                try {
                    await DynamicModel.insertMany(results);
                    console.log('CSV data imported successfully!');

                    fs.writeFileSync('generatedSchema.json', JSON.stringify(schemaFields, null, 2));
                    console.log('Schema dump file created: generatedSchema.json');
                    resolve();
                } catch (err) {
                    reject('Error inserting data:', err);
                } 
            });
    });
};

module.exports = {importData};
