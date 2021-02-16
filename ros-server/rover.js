// All of the code in this folder is adapted from NASA's OpenMCT Tutorial.



module.exports = Rover

function Rover(modules, URL) {

    var ROSLIB = require('roslib');

    this.state = {};
    this.history = {};
    this.listeners = [];

    var ros = new ROSLIB.Ros({url : URL});

    //Create topics and callbacks for each node
    for (let x=0; x < modules['modules'].length; x++) {
        this.history[modules['modules'][x].key] = [];
        for (let y=0; y < modules['modules'][x]["values"].length; y++) {
            let cModule = modules['modules'][x]["values"][y];
            if (cModule.key !== 'timestamp') {
                let tempTopic = new ROSLIB.Topic({
                    ros : ros,
                    name : cModule.topic,
                    messageType: cModule['message-type']
                });
                this.callbackHandler(tempTopic,cModule,this);
            }
            
        }

    }

    setInterval(function () {
        Object.keys(modules['modules']).forEach(function(idm){
            this.generateTelemetry(modules['modules'][idm]);
        }, this);
    }.bind(this), 100);
    console.log("Rover Connected!");
};


Rover.prototype.callbackHandler = function(tempTopic,modules,rover) {
    tempTopic.subscribe(
        function (message) {rover.state[modules.key] = message.data}
    );
}


/**
 * Takes a measurement of spacecraft state, stores in history, and notifies 
 * listeners.
 */
Rover.prototype.generateTelemetry = function (cModule) {
    var timestamp = Date.now(), sent = 0;
    var state = {timestamp: timestamp, id: cModule.key}
    Object.keys(cModule.values).forEach( function(id) {

        ids = cModule.values[id]
        if (ids.key !== 'timestamp') {
            state[ids.key] = this.state[ids.key]
        }

    }, this);

    Check = true;
    Object.keys(state).forEach(function(id) {
        if (!state[id] && id !== 'utc') {
            Check = false;
        }
    })
    if (Check || !cModule.graph) {
        this.notify(state);
        this.history[cModule.key].push(state);
    }
};

//Sends info to listeners
Rover.prototype.notify = function (point) {
    this.listeners.forEach(function (l) {
        l(point);
    });
};

//Sets up listener
Rover.prototype.listen = function (listener) {
    this.listeners.push(listener);
    return function () {
        this.listeners = this.listeners.filter(function (l) {
            return l !== listener;
        });
    }.bind(this);
};