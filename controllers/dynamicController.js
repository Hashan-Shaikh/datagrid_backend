const {generateSchema} = require('../schemaHandler');
const fs = require('fs');
const mongoose = require('mongoose');

exports.getAllData = async (req, res) => {
    try {
        const {DynamicModel, headers} = await generateSchema();
        const data = await DynamicModel.find();
        const table = {
            headers,
            data,
        }
        res.status(200).json(table);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getDataById = async (req, res) => {
    try {
        const id = req.query._id; // Extract the '_id' from the URL
        console.log(id);
        const { DynamicModel, headers } = await generateSchema(); // Generate schema dynamically

        // Find the record by '_id'
        const record = await DynamicModel.findById(id);

        if (!record) {
            // If the record is not found, return a 404 status
            return res.status(404).json({ message: "Record not found" });
        }


        res.status(200).json(record);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteDataById = async (req, res) => {
    try {
        const id = req.query._id; // Extract the '_id' from the URL
        console.log(`Deleting record with ID: ${id}`);
        
        const { DynamicModel } = await generateSchema(); // Generate schema dynamically

        // Find the record by '_id' and delete it
        const record = await DynamicModel.findByIdAndDelete(id);

        if (!record) {
            // If the record is not found, return a 404 status
            return res.status(404).json({ message: "Record not found" });
        }

        res.status(200).json({ message: "Record deleted successfully", record });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.filterDataByParams = async (req, res) => {
    try {
        // Destructure the query parameters
        const { column, operation, value } = req.query;

        // Validate input
        if (!column || !operation || value === undefined) {
            return res.status(400).json({ message: 'Missing required parameters' });
        }

        // Get the dynamic model and headers
        const { DynamicModel, headers } = await generateSchema();

        // Check if the column exists in headers
        if (!headers.includes(column)) {
            return res.status(400).json({ message: 'Invalid column name' });
        }

        // Prepare the query object based on the operation
        let query = {};

        switch (operation) {
            case 'contains':
                query[column] = { $regex: value, $options: 'i' };  // Case-insensitive regex match
                break;

            case 'equals':
                query[column] = value;  // Exact match
                break;

            case 'starts with':
                query[column] = { $regex: `^${value}`, $options: 'i' };  // Match values that start with the given value
                break;

            case 'ends with':
                query[column] = { $regex: `${value}$`, $options: 'i' };  // Match values that end with the given value
                break;

            case 'is empty':
                query[column] = { $in: [null, ''] };  // Match values that are empty or null
                break;

            default:
                return res.status(400).json({ message: 'Invalid operation' });
        }

        // Perform the query on the DynamicModel
        const data = await DynamicModel.find(query);

        // Return the filtered data
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



exports.searchData = async (req, res) => {
    const searchTerm = req.query.searchTerm || '';
    try {

        const {DynamicModel, headers} = await generateSchema();
        
         // Dynamically create the $or array
         const searchConditions = headers.map(header => ({
            [header]: { $regex: searchTerm, $options: 'i' }
        }));

        const data = await DynamicModel.find({
            $or: searchConditions
        });

        console.log(data);

        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};