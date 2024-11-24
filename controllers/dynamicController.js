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