const knex = require('../db/knex');

module.exports = async function globalTeardown() {
    console.log('Cleaning up test database...');
    try {
        await knex.migrate.rollback(); 

        await knex.destroy(); 
        console.log('Test database cleanup complete.');
    } catch (error) {
        console.error('Test database cleanup failed:', error);
    }
}