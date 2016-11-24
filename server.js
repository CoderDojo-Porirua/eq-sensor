// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var moment = require('moment');

var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data

app.use(bodyParser.json()); // for parsing application/json
//app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));





///////////////////////////////////////////////////////////////////////////////
// Logging stuff....
///////////////////////////////////////////////////////////////////////////////
var winston = require('winston');

//
// Requiring `winston-papertrail` will expose
// `winston.transports.Papertrail`
//
require('winston-papertrail').Papertrail;

var winstonPapertrail = new winston.transports.Papertrail({
  host: 'logs4.papertrailapp.com',
  port: 40894
})
var winstonConsole = new winston.transports.Console({
})

winstonPapertrail.on('error', function(err) {
  // Handle, report, or silently ignore connection errors and failures
});

var logger = new winston.Logger({
  transports: [winstonPapertrail, winstonConsole]
});

winston.level = 'debug'
logger.info('eq-monitor starting');

///////////////////////////////////////////////////////////////////////////////




///////////////////////////////////////////////////////////////////////////////
// Routing
///////////////////////////////////////////////////////////////////////////////


// http://expressjs.com/en/starter/basic-routing.html

///////////////////////////////////////////////////////////////////////////////
// Get the main page - this is the first request in the app - return the HTML page
///////////////////////////////////////////////////////////////////////////////

app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

///////////////////////////////////////////////////////////////////////////////
// Get all the things!
///////////////////////////////////////////////////////////////////////////////

app.get("/data", function (request, response) {
  response.send(data);
});

///////////////////////////////////////////////////////////////////////////////
// Get some of the things!
///////////////////////////////////////////////////////////////////////////////

app.get("/latest_data/:count", function (request, response) {
  response.send(data.slice(0, request.params.count));
});

app.get("/latest_magnitudes/:count", function (request, response) {
  response.send(magnitudes.slice(0, request.params.count));
});

///////////////////////////////////////////////////////////////////////////////
// Send some data and add to the array
///////////////////////////////////////////////////////////////////////////////

app.post('/data', upload.array(), function (request, response, next) {
  logger.info('Data');
  var data_point = request.body;
  data_point.time = new moment();
  data.unshift(data_point);
  logger.debug(data.length);
  
  magnitudes.unshift({time: data_point.time, magnitude: data_point.magnitude});
  response.sendStatus(200);
});



///////////////////////////////////////////////////////////////////////////////
// Data structures - storing array in memory
///////////////////////////////////////////////////////////////////////////////

var now = new moment();

var data = [
  {
    id: 'Test data',
    time: new moment(now.add(1, 'second')),
    x: 1.0,
    y: 0.0,
    z: 0.0
  },
  {
    id: 'Test data',
    time: new moment(now.add(1, 'second')),
    x: 0.0,
    y: 1.0,
    z: 0.0
  },
  {
    id: 'Test data',
    time: new moment(now.add(1, 'second')),
    x: 0.0,
    y: 0.0,
    z: 1.0
  }
];

var magnitudes = []

///////////////////////////////////////////////////////////////////////////////
// Let's GO!
///////////////////////////////////////////////////////////////////////////////


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  logger.info('Your app is listening on port ' + listener.address().port);
});