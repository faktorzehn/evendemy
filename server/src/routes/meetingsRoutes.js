module.exports = function (server, config, production_mode) {

    var meetingService = require('../services/meetingService');
    var userService = require('../services/userService');
    var settingsService = require('../services/settingsService');

    server.get('/api/meetings', function (req, res, next) {
        meetingService.getMeetings(req.query).then(function (meetings) {
            res.send(meetings);
            return next();
        }, function (err) {
            res.send(500, { error: err });
            return next();
        });
    });

    server.get('/api/meetings/attending/confirmed/:username', function (req, res, next) {
        if (req.params.username !== undefined) {
            settingsService.getSettings(req.params.username)
            .then(settings => {
                if(req.params.username===req.user.uid){
                    return req.params.username;
                }
                if(settings && settings.summary_of_meetings_visible === true){
                    return req.params.username;
                }
                throw Error('Not allowed');
            })
            .then(meetingService.getMeetingsForUserWhichTookPart)
            .then( meetings => res.send(meetings))
            .catch( err => res.send(500, { error: err })); 
        } else {
            res.send(500, { error: 'no username specified' });
            return next();
        }
    });

    server.get('/api/meetings/attending-information/:username', function (req, res, next) {
        if (req.params.username !== undefined) {
            settingsService.getSettings(req.params.username)
            .then(settings => {
                if(req.params.username===req.user.uid){
                    return req.params.username;
                }
                if(settings && settings.summary_of_meetings_visible === true){
                    return req.params.username;
                }
                throw Error('Not allowed');
            })
            .then(meetingService.getAttendingInformationForUser)
            .then( meetings => res.send(meetings))
            .catch( err => res.send(500, { error: err })); 
        } else {
            res.send(500, { error: 'no username specified' });
            return next();
        }
    });

    server.get('/api/meetings/author/:username', function (req, res, next) {
        if (req.params.username !== undefined) {
            settingsService.getSettings(req.params.username)
            .then(settings => {
                if(req.params.username===req.user.uid){
                    return req.params.username;
                }
                if(settings && settings.summary_of_meetings_visible === true){
                    return req.params.username;
                }
                throw Error('Not allowed');
            })
            .then( meetingService.getMeetingsFromAuthor)
            .then( meetings => res.send(meetings))
            .catch( err => res.send(500, { error: err })); 
        } else {
            res.send(500, { error: 'no username specified' });
            return next();
        }
    });

}