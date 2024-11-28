const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multer'); // Multer middleware
const uploadController = require('../controllers/fileUploadController');

// Route for file upload
router.post('/upload', upload.single('file'), uploadController.uploadFile);

module.exports = router;
