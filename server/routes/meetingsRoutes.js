module.exports = function (server, config, production_mode) {

    var meetingService = require('../services/meetingService');

    server.get('/meetings', function (req, res, next) {
        meetingService.getMeetings(req.params).then(function (meetings) {
            res.send(meetings);
        }, function (err) {
            return res.send(500, { error: err });
        });

        return next();
    });

    server.get('/meetings/my/:username', function (req, res, next) {
        if (req.params.username !== undefined) {
            meetingService.getMeetingsForUser(req.params.username).then(function (meetings) {
                res.send(meetings);
            }, function (err) {
                res.send(500, { error: err });
            });
        } else {
            res.send(500, { error: 'no username specified' });
            return;
        }
    });

}