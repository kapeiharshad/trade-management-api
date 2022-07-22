const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const fs = require('fs');
const path = require('path');

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const logger = require('./helpers/logger.helper');

// middleware
app.use(cookieParser());
app.use(express.json()); // this is a alternate of bodyparser

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Documentation',
    version: '1.0.0',
    description: 'This is a documentation of REST API applications.',
    license: {
      name: 'Licensed Under MIT',
      url: 'https://spdx.org/licenses/MIT.html',
    },
    contact: {
      name: 'JSDoc',
      url: 'https://jsdoc.app/',
    },
  },
  servers: [
    {
      url: process.env.SWAGGER_PORT,
      description: 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//routing
fs.readdirSync(path.normalize('./routes')).map(file => {
  try {
    const routeName = file.includes('.route.js')
      ? file.split('.route.js').join('')
      : '';
    if (routeName) {
      app.use(`/${routeName}`, require(`./routes/${file}`));
    } else {
      throw new Error(`Extension of ${file} routes file should be '.route.js'`);
    }
  } catch (error) {
    logger.error('Server routing error ', { errorMsg: error });
  }
});

module.exports = app;
