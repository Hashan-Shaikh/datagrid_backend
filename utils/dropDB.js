const mongoose = require('mongoose');

// Function to drop a specific database by name
async function dropDatabaseByName(dbName) {
    try {
      // Get the database connection
      const db = mongoose.connection.useDb(dbName);
  
      // Drop the database using native MongoDB driver
      await db.db.dropDatabase();
      console.log(`Database ${dbName} dropped successfully.`);
    } catch (error) {
      console.error(`Error dropping database ${dbName}:`, error.message);
    }
}

module.exports = dropDatabaseByName;