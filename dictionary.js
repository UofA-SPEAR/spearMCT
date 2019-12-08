function DictionaryPlugin() {
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
        return getDictionary().then(function (dictionary) {
            if (identifier.key === 'rover') {
                return {
                    identifier: identifier,
                    name: dictionary.name,
                    type: 'folder',
                    location: 'ROOT'
                };
            } else {
                var measurement = dictionary.measurements.filter(function (m) {
                    return m.key === identifier.key;
                })[0];
                return {
                    identifier: identifier,
                    name: measurement.name,
                    type: 'spear.telemetry',
                    telemetry: {
                        values: measurement.values
                    },
                    location: 'spear.gui:rover'
                };
            }
        });
    }
};

function getDictionary() {
    return http.get('/dictionary.json')
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
        return getDictionary()
            .then(function (dictionary) {
                return dictionary.measurements.map(function (m) {
                    return {
                        namespace: 'spear.gui',
                        key: m.key
                    };
                });
            });
    }
};
