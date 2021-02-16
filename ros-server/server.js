/**
 * Basic implementation of a history and realtime server.


 All of the code in this folder is adapted from NASA's OpenMCT Tutorial.
 
 */


// Determine if a URL is provided. If not, then run the server in offline mode.
if (!process.argv[2]) {
	var URL = ''
	console.log("No rover IP Address provided, running in offline mode.")
} else {
	var URL = process.argv[2]
	console.log("Connecting to Roslib at: "+process.argv[2])
}

console.log("\n\nWelcome to SpearMCT!\n\n")


// Load modules
var Rover = require('./rover');
var RealtimeServer = require('./realtime-server');
var HistoryServer = require('./history-server');
var StaticServer = require('./static-server');

var fs = require('fs')
var expressWs = require('express-ws');
var app = require('express')();
expressWs(app);



let dict = JSON.parse(fs.readFileSync('modules.json'));


// Init Objects
var rover = new Rover(dict, URL);
var realtimeServer = new RealtimeServer(rover);
var historyServer = new HistoryServer(rover);
var staticServer = new StaticServer();


// Start Webhooks
app.use('/realtime', realtimeServer);
app.use('/history', historyServer);
app.use('/', staticServer);

var port = process.env.PORT || 8080

app.listen(port, function () {
    console.log('Open MCT hosted at http://localhost:' + port);
    console.log('History hosted at http://localhost:' + port + '/history');
    console.log('Realtime hosted at ws://localhost:' + port + '/realtime');
});
