const app = require('./src/app');
const knex = require('./src/db/knex');
const port = process.env.PORT || process.env.API_PORT || 3000;

knex.raw('SELECT 1+1 AS result')
    .then(() => {
        console.log('Database connection successful!');
    })
    .catch((error) => {
        console.error('Database connection failed:', error);
        process.exit(1);
    });

app.listen(port, () => {
    console.log(`Server online on port ${port}`);
})