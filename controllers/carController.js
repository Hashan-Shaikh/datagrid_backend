const {generateSchema} = require('../schemaHandler');
const fs = require('fs');
const mongoose = require('mongoose');

exports.getAllCars = async (req, res) => {
    try {
        const {DynamicModel, headers} = await generateSchema();
        const cars = await DynamicModel.find();
        res.status(200).json(cars);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.searchCars = async (req, res) => {
    const searchTerm = req.query.searchTerm || ''; 
    try {
        const cars = await carData.find({
            $or: [
                { Brand: { $regex: searchTerm, $options: 'i' } },
                { Model: { $regex: searchTerm, $options: 'i' } },
            ],
        });
        res.status(200).json(cars);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};