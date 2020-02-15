# SpearMCT

## How to install

### Acknowledgements
We are currently using NASA's OpenMCT Tutorial repository as the base of this repository.


### Prerequisites
- nodejs & npm
- git (not required)
- ElasticDB/CouchDB (not required)

1. Clone this repository to your computer (or download it through the github page)
2. Open Terminal (on Unix)/Power Shell (on Windows)
3. Navigate to the folder directory using cd
4. Run `npm start`

## How to add modules to SpearMCT

### Prerequisites
- nodejs & npm
- git (not required)
- A text editor

1. Open the modules.json file in a text editor of your choice
2. Under the modules key, add the following, edit it and remove the comments (//)
```javascript
        {
            "name": "Battery", //The name that appears to the user
            "key": "rv.battery", //The ID of the object, should start with rv.
            "graph": true, //Does this need to be graphed?
            "values": [
                { // If you want more values, duplicate this value object, then change values
                    "name": "Voltage", //The name of the value that appears to the user
                    "key": "rv.battery.voltage", // the ID of the value, should start with the key above
                    "units": "V", //Units (not needed if not a graph)
                    "format": "float", //Type of data, usually float, string, or boolean
                    "min": 0, //Only for graphs
                    "max": 100, //Only for graphs
                    "hints": { //Only for graphs
                        "range": 1
                    },
                    "topic": "web/battery/voltage", //The ros topic on the rover
                    "message-type": "std_msgs/Float64" //Type of data
                },
                { // WE NEED THIS, DO NOT REMOVE
                    "name": "Timestamp",
                    "key": "utc",
                    "source": "timestamp",
                    "format": "utc"
                }
            ]
        }
```
3. Save file, then open Terminal (on Unix)/Power Shell (on Windows)
4. Navigate to the folder directory using cd
5. Run `npm start` to test if the modules were added
