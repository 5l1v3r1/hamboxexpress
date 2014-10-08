/*jshint node:true*/
var express = require('express');
var routes = require('./serverjs/routes.js');
var dbroutes = require('./serverjs/dbroutes.js');
var websockethandler = require('./serverjs/websockethandler.js');
var http = require('http');
var path = require('path');
var favicon = require('serve-favicon');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

app.enable('trust proxy');
app.set('port', process.env.VCAP_APP_PORT || 8000);
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
//app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(favicon('public/favicon.ico'));

// Handle Errors gracefully
app.use(function(err, req, res, next) {
    if(!err) return next();
    console.log(err.stack);
    res.json({error: true});
});

// Main App Page
app.get('/', routes.index);

// MongoDB API Routes
app.get('/wirelessconfigs', dbroutes.wirelessconfiglist);
app.post('/websockethandler', websockethandler.websockethandler);

io.sockets.on('connection', websockethandler.websockethandler);

server.listen(app.get('port'), function(){
  console.log('Hambox Express server listening on port ' + app.get('port'));
});
