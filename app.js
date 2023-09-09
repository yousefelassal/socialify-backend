const express = require('express')
require('express-async-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const config = require('./utils/config');
const mongoose = require('mongoose');
const cors = require('cors');

const indexRouter = require('./routes/index');
const postsRouter = require('./routes/posts');
const usersRouter = require('./controllers/userController');
const loginRouter = require('./controllers/loginController');
const searchRouter = require('./controllers/searchController');

const app = express();

mongoose.connect(config.MONGODB_URI).then(() => {
    console.log('connected to MongoDB');
}).catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/posts', postsRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/search', searchRouter);

module.exports = app;
