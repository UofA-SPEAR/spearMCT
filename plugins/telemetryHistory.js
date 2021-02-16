/**
 * Basic historical telemetry plugin.
   Adapted from NASA's OpenMCT tutorial
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