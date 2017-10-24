var harvestApp = require('./app/api.js'),
    woodman = require('woodman');

// since this initiates the code with a worker process we need to configure woodman
woodman.load('console %domain - %message');
var logger = woodman.getLogger('events-reader');

// initiate the oplog eventsReader with the Mongodb oplog url and start tailing
// (hosted approach : https://blog.compose.io/the-mongodb-oplog-and-node-js/)
harvestApp.eventsReader(process.env.OPLOG_MONGODB_URL)
    .then(function (EventsReader) {
        logger.info('start tailing the oplog');
        new EventsReader().tail();
    })
    .catch(function(e) {
        logger.error(e);
    });

