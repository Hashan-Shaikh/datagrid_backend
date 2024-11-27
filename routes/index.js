const express = require('express');
const dynamicRoute = require('./dynamicRoute');

const router = express.Router();

router.use('/dynamic', dynamicRoute);

module.exports = router;