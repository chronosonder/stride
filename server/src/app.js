const { NotFoundError } = require('./utils/customErrors');

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const errorMiddleware = require('./middleware/errorMiddleware');

//Route imports
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');

const app = express();

//Middleware
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

//Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

//Error handling middleware
app.use((req, res, next) => {
    next(new NotFoundError('Route not found!'));
});
app.use(errorMiddleware);

module.exports = app;