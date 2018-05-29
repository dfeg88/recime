require('./config/config');

const express = require('express');
const _ = require('lodash');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const passport = require('passport');

// Models
const {User} = require('./models/user');
const {Recipe} = require('./models/recipe');
const {mongoose} = require('./db/mongoose');

const app = express();
const port = process.env.PORT;

//Routes
const users = require('./routes/users');
const recipes = require('./routes/recipes');
const shoppingLists = require('./routes/shopping-lists');

const axios = require('axios');

// CORS middleware
app.use(cors());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body parser middleware
app.use(bodyParser.json());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
require('./middleware/passport')(passport);

// Routes
app.use('/users', users);
app.use('/recipes', recipes);
app.use('/shopping-lists', shoppingLists);

// Index Route
app.get('/', (req, res) => {
  res.send('Invalid Endpoint');
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = {app};
