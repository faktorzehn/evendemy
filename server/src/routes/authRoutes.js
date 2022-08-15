module.exports = function (server, config, production_mode) {
    
    var userService = require('../services/userService');

    server.post('/auth', function (req, res, next) {
        userService.saveUser(req.user).then(function (user) {
            console.log('user has logged in the first time...the account has been created');
            res.send(true);
            return next();
        }, function(error){
            //user already exists - at the moment no update, maybe an other solution in the future
            res.send(true);
            return next();
        });
    });

    server.get('/auth', function (req, res, next) {
        res.send(req.user);
        return next();
    });
}