var woodman = require('woodman'),
    domainMiddleware = require('express-domain-middleware');

// woodman logger is setup to track the domain id
// this facilitates correlation of log messages across requests
woodman.load('console %domain - %message');
var logger = woodman.getLogger('app');

// require the api builder function, this returns a harvest instance
var harvestApp = require('./app/api');
// get a handle on the express instance
var express = harvestApp.router;

// express-domain-middleware wraps the req/res with a domain,
// so it's available to woodman logger
express.use(domainMiddleware);

harvestApp.listen(process.env.PORT, onListen);

function onListen() {
    logger.info('listening on port ' + process.env.PORT);
}

