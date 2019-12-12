function spearMCT() {
    return function install(openmct) {
        openmct.install(SpearModulePlugin());
        openmct.install(RealtimeTelemetryPlugin());
        openmct.install(HistoricalTelemetryPlugin());
    }
}




function SpearModulePlugin() {
    return function install(openmct) {
        openmct.objects.addRoot({
            namespace: 'spear.gui',
            key: 'rover'
        });

        openmct.objects.addProvider('spear.gui', objectProvider);
        openmct.composition.addProvider(compositionProvider);

        openmct.types.addType('spear.telemetry', {
            name: 'Telemetry Point',
            description: 'Telemetry point.',
            cssClass: 'icon-telemetry'
        });
    }
};

var objectProvider = {
    get: function (identifier) {
        return getModules().then(function (dictionary) {
            if (identifier.key === 'rover') {
                return {
                    identifier: identifier,
                    name: dictionary.name,
                    type: 'folder',
                    location: 'ROOT'
                };
            } else {
                var modules = dictionary.modules.filter(function (m) {
                    return m.key === identifier.key;
                })[0];
                return {
                    identifier: identifier,
                    name: modules.name,
                    type: 'spear.telemetry',
                    telemetry: {
                        values: modules.values
                    },
                    location: 'spear.gui:rover'
                };
            }
        });
    }
};

function getModules() {
    return http.get('/modules.json')
        .then(function (result) {
            return result.data;
        });
}


var compositionProvider = {
    appliesTo: function (domainObject) {
        return domainObject.identifier.namespace === 'spear.gui' &&
               domainObject.type === 'folder';
    },
    load: function (domainObject) {
        return getModules()
            .then(function (dictionary) {
                return dictionary.modules.map(function (m) {
                    return {
                        namespace: 'spear.gui',
                        key: m.key
                    };
                });
            });
    }
};


/**
 * Basic historical telemetry plugin.
 */

function HistoricalTelemetryPlugin() {
    return function install (openmct) {
        var provider = {
            supportsRequest: function (domainObject) {
                return domainObject.type === 'spear.telemetry';
            },
            request: function (domainObject, options) {
                //console.log(options)
                var url = '/history/' +
                    domainObject.identifier.key +
                    '?start=' + options.start +
                    '&end=' + options.end;
    
                return http.get(url)
                    .then(function (resp) {
                        //console.log(resp)
                        return resp.data;
                    });

            }
        };
    
        openmct.telemetry.addProvider(provider);
    }
}

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