module.exports = function (server, config, production_mode) {

    server.get('/ping', function (req, res, next) {
        res.send('ping');
        return next();
    });

    require('./authRoutes.js')(server, config, production_mode);
    require('./userRoutes.js')(server, config, production_mode);
    require('./usersRoutes.js')(server, config, production_mode);
    require('./meetingRoutes.js')(server, config, production_mode);
    require('./meetingsRoutes.js')(server, config, production_mode);    
    require('./tagsRoutes.js')(server, config, production_mode);

};