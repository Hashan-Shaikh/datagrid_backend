const { generateSchema } = require('../utils/schemaHandler');

//generate mongoose dynamic schema model if dont exist and use that model to fetch all data
//also fetches headers name for facilitating frontend grid column names
const fetchAllData = async () => {
    const { DynamicModel, headers } = await generateSchema();
    const data = await DynamicModel.find();
    return { headers, data };
};

//for fetching particular record when you navigate to details page of a certain record
const fetchDataById = async (id) => {
    const { DynamicModel } = await generateSchema();
    return await DynamicModel.findById(id);
};

//deleting a certain record based on id
const deleteDataById = async (id) => {
    const { DynamicModel } = await generateSchema();
    return await DynamicModel.findByIdAndDelete(id);
};

//for creating filter on frontend according to different filters applied
const filterData = async (column, operation, value) => {
    const { DynamicModel, headers } = await generateSchema();

    if (!headers.includes(column)) {
        throw new Error('Invalid column name');
    }

    let query = {};
    switch (operation) {
        case 'contains':
            query[column] = { $regex: value, $options: 'i' };
            break;
        case 'equals':
            query[column] = value;
            break;
        case 'starts with':
            query[column] = { $regex: `^${value}`, $options: 'i' };
            break;
        case 'ends with':
            query[column] = { $regex: `${value}$`, $options: 'i' };
            break;
        case 'is empty':
            query[column] = { $in: [null, ''] };
            break;
        default:
            throw new Error('Invalid operation');
    }

    return await DynamicModel.find(query);
};

//returns all the records that meet the regex pattern while ignoring the case sensitivity
const searchData = async (searchTerm) => {
    const { DynamicModel, headers } = await generateSchema();
    const searchConditions = headers.map(header => ({
        [header]: { $regex: searchTerm, $options: 'i' }
    }));

    return await DynamicModel.find({ $or: searchConditions });
};

module.exports = {
    fetchAllData,
    fetchDataById,
    deleteDataById,
    filterData,
    searchData,
};
