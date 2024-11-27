const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const csvParser = require('csv-parser');

// Function to calculate the hash of an array (e.g., column names)
const calculateHash = (columns) => {
  // Sort the columns to ensure consistent ordering before hashing
  const sortedColumns = columns.sort();
  // Create a hash from the sorted column names
  return crypto.createHash('sha256').update(sortedColumns.join(',')).digest('hex');
};

// Function to load the JSON schema and generate its hash
const getSchemaHash = (jsonFilePath) => {
  try {
    const schemaData = fs.readFileSync(jsonFilePath, 'utf-8');
    const schema = JSON.parse(schemaData);
    const schemaColumns = Object.keys(schema); // Extract column names
    return calculateHash(schemaColumns);
  } catch (error) {
    throw new Error(`Failed to load JSON schema: ${error.message}`);
  }
};

// Function to extract CSV headers and generate their hash
const getCSVHash = async (csvFilePath) => {
    let headers = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(csvFilePath)
        .pipe(csvParser())
        .on('headers', (fileHeaders) => {
            headers = fileHeaders; // Extract headers
        })
        .on('data', ()=>{
            
        })
        .on('end', async () => {
            if (headers.length > 0) {
            resolve(calculateHash(headers)); // Generate hash for the headers
            } else {
            reject(new Error('Failed to process CSV headers.'));
            }
        })
        .on('error', (error) => {
            reject(error);
        });
    });
};

// Function to compare hashes of dump file and csv file uploaded
const validateSchemasWithHash = async () => {
    
    const csvFilePath = path.join(__dirname, '..', 'data', process.env.CSV_FILE);
    const jsonFilePath = path.join(__dirname, '..', process.env.DUMP_FILE);

    if(!csvFilePath){
        console.log('csv file path doesnt exist..')
        return false;
    }

  try {
    // Step 1: Generate hash for the JSON schema
    const schemaHash = getSchemaHash(jsonFilePath);

    // Step 2: Generate hash for the CSV headers
    const csvHash = await getCSVHash(csvFilePath);

    // Step 3: Compare the two hashes
    if (schemaHash === csvHash) {
      console.log("Schemas are equivalent.");
      return true;
    } else {
      console.log("Schemas are not equivalent.");
      return false;
    }
  } catch (error) {
    console.error("Error validating schemas:", error.message);
  }
};

module.exports = validateSchemasWithHash;
