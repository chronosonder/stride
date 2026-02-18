const knexfile = require("../../knexfile");
const environment = process.env.NODE_ENV || 'development';
const config = knexfile[environment];

module.exports = require('knex')(config);