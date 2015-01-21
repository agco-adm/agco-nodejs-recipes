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
        title: String,
        closed: Boolean
    })
    .resource('comment', {
        body: String,
        post: 'post'
    })
    .before(function (req, res) {
        // alias 'this' for easy usage within the promise 'then' function callback scope
        var that = this;
        // if modified, fetch the associated post for the comment
        return harvestApp.adapter.findMany('post', {id: this.links.post})
            .then(function (posts) {
                if (posts.length > 0) {
                    // if the post is closed, throw a JSONAPI_Error with a 400 status code and some detail message
                    // harvest will take care of converting this to a jsonapi spec errors representation
                    // http://jsonapi.org/format/#errors
                    var closed = !!posts[0].closed;
                    if (closed) {
                        throw new harvest.JSONAPI_Error({
                            status: 400,
                            detail: 'post is closed, comments are disabled'
                        });
                    }
                }
                // important ! return that (this alias)
                // to resume normal processing flow
                return that;

            })
    });

module.exports = harvestApp;