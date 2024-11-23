const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');

// Define routes
router.get('/', carController.getAllCars);
router.get('/search', carController.searchCars);

module.exports = router;
