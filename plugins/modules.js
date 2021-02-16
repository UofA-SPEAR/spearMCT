// Adapted from NASA's OpenMCT tutorial


function ModulePlugin() {
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

function getModules() { // Get the JSON for the modules to load - May replace http.js with AJAX
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
