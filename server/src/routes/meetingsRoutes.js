module.exports = function (server, config, production_mode) {

    var meetingService = require('../services/meetingService');
    var userService = require('../services/userService');

    server.get('/meetings', function (req, res, next) {
        meetingService.getMeetings(req.query).then(function (meetings) {
            res.send(meetings);
            return next();
        }, function (err) {
            res.send(500, { error: err });
            return next();
        });
    });

    server.get('/meetings/attending/confirmed/:username', function (req, res, next) {
        if (req.params.username !== undefined) {
            userService.getUserByUsername(req.params.username)
            .then(user => {
                if(req.params.username===req.user.uid){
                    return user.username;
                }
                if(user && user.options && user.options.summary_of_meetings_visible === true){
                    return user.username;
                }
                throw Error('Not allowed');
            })
            .then(meetingService.getMeetingUserForUserWhichTookPart)
            .then( meetings => res.send(meetings))
            .catch( err => res.send(500, { error: err })); 
        } else {
            res.send(500, { error: 'no username specified' });
            return next();
        }
    });

    server.get('/meetings/attending/:username', function (req, res, next) {
        if (req.params.username !== undefined) {
            userService.getUserByUsername(req.params.username)
            .then(user => {
                if(req.params.username===req.user.uid){
                    return user.username;
                }
                if(user && user.options && user.options.summary_of_meetings_visible === true){
                    return user.username;
                }
                throw Error('Not allowed');
            })
            .then(meetingService.getAllMeetingUserForUser)
            .then( meetings => res.send(meetings))
            .catch( err => res.send(500, { error: err })); 
        } else {
            res.send(500, { error: 'no username specified' });
            return next();
        }
    });

    server.get('/meetings/author/:username', function (req, res, next) {
        if (req.params.username !== undefined) {
            userService.getUserByUsername(req.params.username)
            .then(user => {
                if(req.params.username===req.user.uid){
                    return user.username;
                }
                if(user && user.options && user.options.summary_of_meetings_visible === true){
                    return user.username;
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