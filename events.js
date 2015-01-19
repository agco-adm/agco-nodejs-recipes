var harvestApp = require('./app/api.js'),
    woodman = require('woodman');

woodman.load('console %domain - %message');
var logger = woodman.getLogger('events-reader');

harvestApp.eventsReader(process.env.OPLOG_MONGODB_URL)
    .then(function (EventsReader) {
        logger.info('start tailing the oplog');
        new EventsReader().tail();
    })
    .catch(function(e) {
        logger.error(e);
    });

