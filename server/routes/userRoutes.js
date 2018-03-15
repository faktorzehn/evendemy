module.exports = function (server, config, production_mode) {
    
    var userService = require('../services/userService');

    server.get('/user/:username', function (req, res, next) {

        userService.getUserByUsername(req.params.username).then(function (user) {
            if (user !== null) {
                res.send(user);
            }
            else {
                res.send(404, { error: "No user found" });
            }
        }, function (err) {
            return res.send(500, { error: err });
        });

        return next();
    });
}