const knex = require('../db/knex');

module.exports = async function globalSetup() {
    console.log('Setting up test database...');
    try {
        await knex.migrate.rollback();
        
        await knex.migrate.latest();

        // await knex.seed.run();
        
        console.log('Test database ready.');
    } catch (error) {
        console.error('Test database setup failed:', error);
        process.exit(1);
    }
}