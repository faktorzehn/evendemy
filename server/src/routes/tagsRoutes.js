module.exports = function (server, config, production_mode) {
    
    var tagsService = require('../services/tagsService');

    server.get('/api/tags', function (req, res, next) {

        tagsService.getAllTags().then(function (tags) {
            if (tags !== null) {
                res.send(tags.sort());
                return next();
            }
            else {
                res.send(404, { error: "No tags found" });
                return next();
            }
        }, function (err) {
            res.send(500, { error: err });
            return next();
        });
    });
}