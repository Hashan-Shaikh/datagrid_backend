const express = require('express');
const router = express.Router();
const carController = require('../controllers/dynamicController');

// Define routes
router.get('/', carController.getAllData);
router.get('/search', carController.searchData);

module.exports = router;
