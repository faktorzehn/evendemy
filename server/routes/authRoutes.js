module.exports = function (server, config, production_mode) {
    
    var userService = require('../services/userService');

    server.post('/auth', function (req, res, next) {
        userService.saveUser(req.user).then(function (user) {
            res.send(true);
        }, function(error){
            //user already exists - at the moment no update, maybe an other solution in the future
            res.send(true);
        });
        
        return next();
    });

    server.get('/auth', function (req, res, next) {
        res.send(req.user);
        return next();
    });
}