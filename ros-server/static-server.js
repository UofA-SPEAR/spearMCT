// All of the code in this folder is adapted from NASA's OpenMCT Tutorial.

var express = require('express');

function StaticServer() {
    var router = express.Router();

    router.use('/', express.static(__dirname + '/..'));

    return router
}

module.exports = StaticServer;
