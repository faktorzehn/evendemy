module.exports = function (server, config, production_mode) {
    
    var settingsService = require('../services/settingsService');

    server.put('/settings', function (req, res, next) {
        settingsService.saveSettings(req.user.uid, req.body).then(function (settings) {
            res.send(settings);
            return next();
        }, function (err) {
            console.log(err);
            res.send(500, { error: 'Settings could not be saved.' });
            return next();
        });
    });

    server.get('/settings', function (req, res, next) {
        settingsService.getSettings(req.user.uid).then(function (settings) {
            res.send(settings);
            return next();
        }, function (err) {
            res.send(500, { error: err });
            return next();
        });
    });
}