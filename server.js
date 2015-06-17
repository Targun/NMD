var express  = require('express');
var mongoose = require('mongoose');
var initDB   = require('./initDB');
var User     = require('./models/user');

// environment variables can be set in fig.yml
// mongodb configuration
config.mongodb = {
  hostname: process.env.MONGO_PORT_27017_TCP_ADDR || "localhost",
  database: process.env.MONGO_DATABASE || "blog",
  port: process.env.MONGO_PORT_27017_TCP_PORT || "27017"
}

var MONGO_URI = "mongodb://" + config.mongodb.hostname + ":" + config.mongodb.port + "/" + config.mongodb.database;
var PORT      = process.env.PORT      || 8080;
var NUM_USERS = process.env.NUM_USERS || 10;

var dataReady = new mongoose.Promise(); // resolves when db is done initializing

var app = express();

// use ejs for template engine and configure it

app.engine('html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

// this catch-all route lets us accept requests right away 
// but wait to respond until db initializes

app.use(function(req, res, next) {
  dataReady.then(next);
});

// main route - gets users from db and displays them

app.get('/', getUsers, function(req, res) {
  res.render('users');
});

// after connecting to db, init data and resolve dataReady

mongoose.connection.once('open', function() {
  console.log('Connected!');
  initDB(NUM_USERS).then(function() {
    dataReady.resolve();
  }, function(err) {
    console.log('ERROR initializing data: ' + err);
  });
});

// retries with exponential backoff if connection fails

function connect(attempt) {
  console.log('Connecting to: ' + MONGO_URI + ' ...'); 
  mongoose.connect(MONGO_URI, function(err, res) {
    if (err) {
      attempt = attempt || 0;
      var timeoutSecs = Math.exp(attempt);
      console.log('ERROR! ' + err);
      console.log('Retrying in ' + timeoutSecs + 's.');
      setTimeout(connect, timeoutSecs * 1000, attempt + 1);
    }
  });
}


app.listen(PORT, function(){
  console.log('Magic happens on port ' + PORT);
});


// connect to mongo and start listening for requests
connect();

// middleware - used by any routes that want all users
// note view templates can use any properties set on res.locals

function getUsers(req, res, next) {
  User.find({}).sort('-age').exec(function(err, users) { 
    if (err) { 
      res.end('Error querying users. ' + err);
    } else {
      res.locals.users = users;
      next();
    }
  });
}

