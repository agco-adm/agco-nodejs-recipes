var $http = require('http-as-promised');

var baseUri = process.env.BASE_URI;

$http({
    uri: baseUri + '/posts', method: 'POST', json:{
        "posts": [
            {
                "title": "Dependency Injection is Not a Virtue"
            }
        ]
    }
})
    .spread(function (response, post1) {

        var postId = post1.posts[0].id.toString();
        return $http({
            uri: baseUri + '/comments', method: 'POST', headers:{Accept:'application/json'}, json:{
                comments: [
                    {
                        body: "Dependency Injection is Not a Vice",
                        links: {
                            post: [postId]
                        }
                    }
                ]
            }
        });
    })
    .catch(function (e) {
        console.trace(e);
    });