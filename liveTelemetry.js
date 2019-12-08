/**
 * Basic Realtime telemetry plugin using websockets.
 */
function RealtimeTelemetryPlugin() {
    return function (openmct) {
        var socket = new WebSocket(location.origin.replace(/^http/, 'ws') + '/realtime/');
        var listener = {};
    
        socket.onmessage = function (event) { //This is the callback that handles the inputs
            point = JSON.parse(event.data);
            if (listener[point.id]) { //point.id is the identifier key
                listener[point.id](point);
            }
        };
        
        var provider = {
            supportsSubscribe: function (domainObject) {
                return domainObject.type === 'spear.telemetry'; //If its supported
            },
            subscribe: function (domainObject, callback) {
                listener[domainObject.identifier.key] = callback; //We need this (it links the unsub func)
                socket.send('subscribe ' + domainObject.identifier.key); //Subs
                return function unsubscribe() {
                    delete listener[domainObject.identifier.key]; //Destroys stuff
                    socket.send('unsubscribe ' + domainObject.identifier.key); //Unsubs
                };
            }
        };
        
        openmct.telemetry.addProvider(provider);
    }
}