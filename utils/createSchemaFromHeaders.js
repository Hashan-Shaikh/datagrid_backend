const mongoose = require('mongoose');

//parse the csv file headers and generate the dynamic schema
const createSchemaFromHeaders = (headers) => {
    const schemaFields = {};
    headers.forEach((field) => {
        schemaFields[field] = { type: mongoose.Schema.Types.Mixed };
    });
    return { schemaFields, schema: new mongoose.Schema(schemaFields) };
};

module.exports = createSchemaFromHeaders;
