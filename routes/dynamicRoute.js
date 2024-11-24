const express = require('express');
const router = express.Router();
const dynamicController = require('../controllers/dynamicController');

// Define routes
router.get('/', dynamicController.getAllData);
router.get('/search', dynamicController.searchData);
router.get('/view', dynamicController.getDataById);

module.exports = router;