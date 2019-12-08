/**
 * Basic implementation of a history and realtime server.
 */

var Rover = require('./rover');
var RealtimeServer = require('./realtime-server');
var HistoryServer = require('./history-server');
var StaticServer = require('./static-server');

var fs = require('fs')
var expressWs = require('express-ws');
var app = require('express')();
expressWs(app);

//console.log(JSON.parse(fs.readFileSync('modules.json')))
let dict = JSON.parse(fs.readFileSync('modules.json'));

var rover = new Rover(dict);
var realtimeServer = new RealtimeServer(rover);
var historyServer = new HistoryServer(rover);
var staticServer = new StaticServer();



app.use('/realtime', realtimeServer);
app.use('/history', historyServer);
app.use('/', staticServer);

var port = process.env.PORT || 8080

app.listen(port, function () {
    console.log('Open MCT hosted at http://localhost:' + port);
    console.log('History hosted at http://localhost:' + port + '/history');
    console.log('Realtime hosted at ws://localhost:' + port + '/realtime');
});
