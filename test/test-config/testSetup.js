const mongoose = require('mongoose');
mongoose.promise = global.Promise;
const { seedDatabase } = require('../../seeds');
const logger = require('../../helpers/logger.helper');

async function removeAllCollections() {
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    await collection.deleteMany();
  }
}

async function dropAllCollections() {
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    try {
      await collection.drop();
    } catch (error) {
      // Sometimes this error happens, but you can safely ignore it
      if (error.message === 'ns not found') return;
      // This error occurs when you use it.todo. You can
      // safely ignore this error too
      if (error.message.includes('a background operation is currently running'))
        return;
      logger.error('a background operation is currently running', {
        errorMsg: error.message,
      });
    }
  }
}

module.exports = {
  setupDB(runSaveMiddleware = false) {
    let connectionDB = '';
    // Connect to Mongoose
    beforeAll(async () => {
      try {
        const url = 'mongodb://localhost:27017/test_trade_managements';
        connectionDB = await mongoose.connect(url, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        await seedDatabase(runSaveMiddleware);
      } catch (error) {
        logger.error('Test Server connection error ', { errorMsg: error });
      }
    });

    // Disconnect Mongoose
    afterAll(async () => {
      try {
        await removeAllCollections();
        await dropAllCollections();
        await connectionDB.connection.db.dropDatabase();
        await mongoose.connection.close();
      } catch (error) {
        logger.error('Test Server disconnection error ', { errorMsg: error });
      }
    });
  },
};
