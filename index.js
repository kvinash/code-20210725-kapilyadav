const express = require('express');
const mongoose = require('mongoose');
const config = require('./config/env')
const cors = require('cors');
const http = require('http');
// Require logger.js
global.logger = require('./Logs/logger');

const fs = require('fs');
const path  = require('path');
mongoose.connect(config.mongo.uri,{ 
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  useCreateIndex: true 
});
mongoose.connection.on('error', function(err) {
  console.error(`MongoDB connection error: ${err}`);
  process.exit(-1); // eslint-disable-line no-process-exit
});
mongoose.connection.on('open', function(err) {
  console.log('app is ready');
});

// Setup server
var app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json())
app.use(cors())


var server = http.createServer(app);
server.listen(3000)
app.set('server', server);



app.use('/api/bmi', require('./server/bmi'));