const fs = require('fs');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

//this function sole purpose is to serve the service with the model to perform db operations
//this function sees that if dump file exists read the schema fields from it and check if mongoose model is not already created make it and return dynamic model and list of headers = [every_column_name]
const generateSchema = async () => {

    let DynamicModel = null;
    let headers = [];

    const dumpFilePath = path.join(__dirname, '..', process.env.DUMP_FILE);

    if (fs.existsSync(dumpFilePath)) {

        const schemaFields = JSON.parse(fs.readFileSync(dumpFilePath, 'utf8'));
        const schema = new mongoose.Schema(schemaFields);

        if(!mongoose.models.dynamicData){
            DynamicModel = mongoose.model('dynamicData', schema);
        }else{
            DynamicModel = mongoose.models.dynamicData;
        }
    
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
