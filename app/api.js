var harvest = require('harvest'),
    RSVP = require('rsvp'),
    woodman = require('woodman'),
    _ = require('lodash');

var logger = woodman.getLogger('api');

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
    // the onChange function map can be supplied with keys : delete, insert and update
    // when a change event occurs the event reader will dispatch this to the correct callback function
    // the id of the doc affected is passed in as an argument
    .onChange({
        delete: function (id) {
            // simple example which cascades a delete to the 1-to-many relationship
            // however any promise or plain value can be returned form these callbacks
            // e.g. make a call to another http endpoint
            // the event reader in the back will retry until the promise returns successfully
            logger.info('delete ' + id);
            return harvestApp.adapter.findMany('comment', {"post": id})
                .then(function (commentsToDelete) {
                    logger.info('cascading post (id=' + id + ') delete to related comments ' + JSON.stringify(commentsToDelete));
                    return RSVP.all(_.map(commentsToDelete, function (commentToDelete) {
                        return harvestApp.adapter.delete('comment', commentToDelete.id);
                    }));
                });
        },
        insert: function (id) {
            logger.info('insert ' + id);
        },
        update: function (id) {
            logger.info('update ' + id);
        }
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