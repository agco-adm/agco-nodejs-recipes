var harvest = require('harvest');

var options = {
    adapter: 'mongodb',
    connectionString: process.env.MONGODB_URL,
    inflect: true
};

// define 2 resources
// posts and comments
// analogue to the examples used on jsonapi.org
var harvestApp = harvest(options)
    .resource('post', {
        title: String
    })
    .resource('comment', {
        body: String,
        post: 'post'
    });

module.exports = harvestApp;