const dynamicService = require('../services/dynamicService');


//call the fetch all data service to fetch all the records to display in a grid
const getAllData = async (req, res) => {
    try {
        const table = await dynamicService.fetchAllData();
        res.status(200).json(table);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//fetches id from the url query and returns the record of that id
const getDataById = async (req, res) => {
    try {
        const id = req.query._id;
        const record = await dynamicService.fetchDataById(id);

        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }

        res.status(200).json(record);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//extract the id from query parameter and call delete service for deleting a record
const deleteDataById = async (req, res) => {
    try {
        const id = req.query._id;
        const record = await dynamicService.deleteDataById(id);

        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }

        res.status(200).json({ message: 'Record deleted successfully', record });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//column: the actual name of column
//operation: starts with, ends with, contains, equals..
//value: with which val the operation should be performed? eg. starts with "bm"
const filterDataByParams = async (req, res) => {
    try {
        const { column, operation, value } = req.query;

        if (!column || !operation || value === undefined) {
            return res.status(400).json({ message: 'Missing required parameters' });
        }

        const data = await dynamicService.filterData(column, operation, value);
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//extract the search term from url query parameter and call the service handling db operations to get all records based on search
const searchData = async (req, res) => {
    try {
        const searchTerm = req.query.searchTerm || '';
        const data = await dynamicService.searchData(searchTerm);
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getAllData,
    getDataById,
    deleteDataById,
    filterDataByParams,
    searchData,
};
