const mongoose = require('mongoose');
require('dotenv').config();
const logger = require('./helpers/logger.helper');
const app = require('./app');

// database connection
const dbURI = process.env.DB_URL;
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(result => {
    app.listen(process.env.PORT);
    logger.info(`Server listening at ${process.env.PORT}`);
  })
  .catch(err => logger.error('Db connection error ', { errorMsg: err }));
