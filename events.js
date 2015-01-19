var harvestApp = require('./app/api.js');

harvestApp.eventsReader(process.env.OPLOG_MONGODB_URL)
    .then(function (reader) {
        reader.tail();
    });

