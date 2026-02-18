const express = require('express');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const knex = require('./src/db/knex');
knex.raw('SELECT 1+1 AS result')
    .then(() => {
        console.log('Database connection successful!');
    })
    .catch((error) => {
        console.error('Database connection failed:', error);
        process.exit(1);
    });

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})