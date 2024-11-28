const express = require('express');
const dynamicRoute = require('./dynamicRoute');
const fileUploadRoute = require('./fileUploadRoute');

const router = express.Router();

router.use('/dynamic', dynamicRoute);
router.use('/file', fileUploadRoute);

module.exports = router;