const fs = require('fs');
const mongoose = require('mongoose');

const dotenv = require('dotenv');

dotenv.config();

const DUMP_FILE_NAME = process.env.DUMP_FILE;

const dumpFilePath = `./${DUMP_FILE_NAME}`;

let DynamicModel = null;
let headers = [];

const generateSchema = async () => {
    if (fs.existsSync(dumpFilePath)) {

        const schemaFields = JSON.parse(fs.readFileSync(dumpFilePath, 'utf8'));
        console.log(schemaFields)
        const schema = new mongoose.Schema(schemaFields);

        if(!mongoose.models.dynamicData){
            DynamicModel = mongoose.model('dynamicData', schema);
        }else{
            DynamicModel = mongoose.models.dynamicData;
        }
    
        //DynamicModel = mongoose.model('dynamicData', schema);
        headers = Object.keys(schemaFields);
    
        console.log('Schema and headers loaded from dump file.');
    } else {
        console.error('Schema dump file not found. Please run importcsv.js to generate the dump.');
        process.exit(1);
    }

    return {
        DynamicModel,
        headers,
    }
}


module.exports = { generateSchema };
