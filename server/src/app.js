const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const errorMiddleware = require('./middleware/errorMiddleware');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

//Routes
app.use('/api/auth', authRoutes);

app.use(errorMiddleware);

const knex = require('./db/knex');
knex.raw('SELECT 1+1 AS result')
    .then(() => {
        console.log('Database connection successful!');
    })
    .catch((error) => {
        console.error('Database connection failed:', error);
        process.exit(1);
    });

module.exports = app;