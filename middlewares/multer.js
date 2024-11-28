const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure the upload directory exists
const UPLOAD_DIR = path.join(__dirname, '../data'); // Adjust path as needed
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueName = `test.csv`;
    cb(null, uniqueName);
  },
});

// File type validation (only CSV)
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'text/csv') {
    cb(null, true);
  } else {
    cb(new Error('Only CSV files are allowed!'), false);
  }
};

// Export Multer instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

module.exports = upload;
