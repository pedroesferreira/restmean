var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cors = require('cors');
var passport = require('passport');
var mongoose = require('mongoose');
var config = require('./config/database');

// Connect To Database
mongoose.connect(config.database);

// On Connection
mongoose.connection.on('connected', function () {
  console.log('Connected to database ' + config.database);
});

// On Error
mongoose.connection.on('error', function (err) {
  console.log('Database error: ' + err);
});

var app = express();

var users = require('./routes/users');

// Port Number
var port = 3000;

// CORS Middleware
app.use(cors());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());

// passport mw
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/users', users);

// Index Route
app.get('/', function (req, res) {
  res.send('Invalid Endpoint');
});

// no caso de tentar entrar por outra route sem ser as esperadas
app.get('*', function (req, res) {
  //res.sendFile(path.join(__dirname, 'public/index.html'));
  res.redirect('/');
});

// Start Server
app.listen(port, function () {
  console.log('Server started on port ' + port);
});