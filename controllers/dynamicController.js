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