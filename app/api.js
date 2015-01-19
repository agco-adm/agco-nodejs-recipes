var harvest = require('harvest');

var options = {
    adapter: 'mongodb',
    connectionString: process.env.MONGODB_URL,
    inflect: true
};

var harvestApp = harvest(options)
    .resource('post', {
        title: String
    })
    .resource('comment', {
        body: String,
        post: 'post'
    });

module.exports = harvestApp;