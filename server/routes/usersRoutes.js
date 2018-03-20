module.exports = function (server, config, production_mode) {
    
    var userService = require('../services/userService');

    server.get('/users', function (req, res, next) {

        userService.getAllUsers().then(function (users) {
            if (users !== null) {
                res.send(users);
            }
            else {
                res.send(404, { error: "No users found" });
            }
        }, function (err) {
            return res.send(500, { error: err });
        });

        return next();
    });
}