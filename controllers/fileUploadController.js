const httpStatus = require('../constants/httpStatus');
const initializeApp = require('../utils/initializeApp');

exports.uploadFile = async (req, res) => {
    try {
      // File details available in req.file
      if (!req.file) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'No file uploaded or invalid file type.' });
      }
        
      await initializeApp();
  
      res.status(httpStatus.OK).json({
        message: 'File uploaded successfully!',
        file: req.file, // Optional: Return file details
      });
    } catch (err) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
};
  