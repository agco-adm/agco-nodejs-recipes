var woodman = require('woodman'),
    domainMiddleware = require('express-domain-middleware');

woodman.load('console %domain - %message');
var logger = woodman.getLogger('app');

var api = require('./app/api');
var express = api.router;

express.use(domainMiddleware);

api.listen(process.env.PORT, onListen);

function onListen() {
    logger.info('listening on port ' + process.env.PORT);
}

