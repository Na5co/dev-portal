const { version } = require('../../package.json');
const config = require('../config/config');

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'Good Life Financial Services',
    version,
    license: {
      name: 'MIT',
      url: 'https://github.com/Na5co/devtal',
    },
  },
  servers: [
    {
      url: `http://localhost:3000/v1`,
      description: 'Development server',
    },
    {
      url: 'https://dev-portal-7xkr.onrender.com/v1',
      description: 'Production server',
    },
  ],
};

module.exports = swaggerDef;
