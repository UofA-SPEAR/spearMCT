# Welcome to Spear MCT.
Spear MCT is an extension of [NASA's OpenMCT](https://github.com/nasa/openmct) built to provide telemetry from [ROS](https://www.ros.org/) via [Roslib](https://github.com/RobotWebTools/roslibjs)

Quickstart Guide:
- Clone this repository with `git clone https://github.com/UofA-SPEAR/spearMCT`
- Navigate into the repository and build the dependancies with `cd spearMCT && npm i`
  - This will take about 30 minutes
- Start the server with `npm start [Webhook url (optional)]`
- Navigate to localhost:8080 in your web browser
  - If you use multiple computers, you only have to do this on one of the computers. On the others, you can still reach the website by going to the host computer's local IP address with the port 8080.
