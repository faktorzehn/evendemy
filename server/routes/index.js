module.exports = function (server, config, production_mode) {

    var _ = require('underscore');
    var moment = require('moment');

    var Comment = require('../models/comment');
    var Meeting = require('../models/meeting');
    var MeetingUser = require('../models/meeting_user');

    var imageService = require('../services/imageService');
    var userService = require('../services/userService');
    var meetingService = require('../services/meetingService');
    var mailService = require('../services/mailService');
    var calendarService = require('../services/calendarService');

    var mailConfig = require('../assets/mail-config.de');

    server.get('/ping', function (req, res, next) {
        res.send('ping');
        return next();
    });

    server.post('/auth', function (req, res, next) {
        userService.saveUser(req.user).then(function () {
            res.send(true);
        });

        return next();
    });

    server.get('/auth', function (req, res, next) {
        res.send(req.user);
        return next();
    });

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

    server.get('/meeting', function (req, res, next) {
        meetingService.getMeetings(req.params).then(function (meetings) {
            res.send(meetings);
        }, function (err) {
            return res.send(500, { error: err });
        });

        return next();
    });

    server.get('/meeting/:mid', function (req, res, next) {
        meetingService.getMeeting(req.params.mid).then(function (meeting) {
            res.send(meeting);
        }, function (err) {
            if (err === '404') {
                return res.send(404, { error: 'No meeting found.' });
            }
            return res.send(500, { error: err });
        });

        return next();
    });

    function getMailAdresses(dbUsers) {
        if (!dbUsers) {
            return [];
        }
        return _.map(dbUsers, function (x) { return x.email; })
    }

    server.post('/meeting', function (req, res, next) {

        meetingService.saveMeeting(req.params, req.username).then(function (meeting) {

            //inform all users about the new meeting entry
            userService.getAllUsers().then(function (users) {
                var view = mailService.renderAllTemplates(mailConfig.informAllMail, meeting, null);
                var sendTo = getMailAdresses(users);
                mailService.sendMail(config, sendTo, view, null, production_mode);
            }, function (err) {
                return res.send(500, { error: err });
            });
            res.send(meeting);
        }, function(err){
            return res.send(500, { error: err });
        });

        return next();
    });

    server.post('/addComment/:mid', function (req, res, next) {
        meetingService.addComment(req.params.mid, req.params).then(function (meeting) {
            res.send(meeting);
        }, function (err) {
            res.send(500, { error: err });
        })

        return next();
    });

    server.put('/meeting/:mid', function (req, res, next) {

        if (req.params.mid !== undefined) {
            meetingService.updateMeeting(req.params.mid, req.params).then(function (meeting) {
                res.send(meeting);
            }, function (err) {
                return res.send(500, { error: err });
            });
        }
        else {
            return res.send(500, { error: 'No mid specified' });
        }

        return next();
    });

    server.del('/meeting/:mid', function (req, res, next) {

        meetingService.deleteMeeting(req.params.mid).then(function (meeting) {
            res.send(meeting);
        }, function (err) {
            return res.send(500, { error: err });
        });

        return next();
    });

    server.get('/meeting_user', function (req, res, next) {

        var filter = {};

        if (req.params.mid !== undefined) {
            filter.mid = req.params.mid;
        }
        if (req.params.username !== undefined) {
            filter.username = req.params.username;
        }
        if (req.params.tookPart !== undefined) {
            filter.tookPart = (req.params.tookPart === 'true');
        }

        MeetingUser.find(filter).where('deleted').eq(false).exec(function (err, meeting_users) {
            if (err) {
                return res.send(500, { error: err });
            }

            res.send(meeting_users);
        });

        return next();
    });

    server.get('/meeting_user/:mid/:username', function (req, res, next) {

        if (req.params.mid !== undefined) {
            meetingService.getUsersForMid(req.params.mid).then(function (users) {
                res.send(users);
            }, function (err) {
                res.send(500, { error: err });
            });
        } else if (req.params.username !== undefined) {
            meetingService.getMeetingsForUser(req.params.username).then(function (meetings) {
                res.send(meetings);
            }, function (err) {
                res.send(500, { error: err });
            });
        } else {
            res.send(500, { error: 'no mid or username specified' });
            return;
        }


        return next();
    });

    server.post('/meeting_user', function (req, res, next) {
        if (req.params.mid === undefined || req.params.username === undefined) {
            return res.send(500, { error: 'no mid or username' });
        }
        meetingService.attendingToMeeting(req.params.mid, req.params.username).then(function (meeting_user) {
            //send mail to the new attendee
            meetingService.getMeeting(req.params.mid).then(function (meeting) {
                if (meeting !== null) {
                    userService.getUserByUsername(req.params.username).then(function (user) {
                        confirmAttendee(meeting, user);
                        notifyAuthor(true, meeting, user);
                    }, function (err) {
                        console.error('post of meeting_user, user not found to send mail: ' + req.params.username + err);
                    });
                }
            }, function (err) {
                console.error('post of meeting_user, meeting not found with mid:' + req.params.mid + ", can not send a mail");
                return;
            })

            res.send(meeting_user);
        }, function (err) {
            return res.send(500, { error: err });
        });

        return next();
    });

    function confirmAttendee(meeting, user) {

        var view = mailService.renderAllTemplates(mailConfig.confirmMail, meeting, user);
        if (!meeting.date || !meeting.startTime || !meeting.endTime) {
            view.body = mailService.renderTemplate(mailConfig.confirmMail.body_no_calendar, meeting, user);
        }

        var sendTo = user.email;

        //create cal attachment
        var attachment;

        if (meeting.date && meeting.startTime && meeting.endTime) {

            var startDate = moment(meeting.date);
            var time = meeting.startTime.split(':');
            startDate.hour(time[0]);
            startDate.minute(time[1]);

            var endDate = moment(meeting.date);
            time = meeting.endTime.split(':');
            endDate.hour(time[0]);
            endDate.minute(time[1]);

            if (config.calendar !== null) {

                var evendemy_event = {
                    start: startDate.toDate(),
                    end: endDate.toDate(),
                    timestamp: new Date(),
                    summary: 'Evendemy:' + meeting.title,
                    organizer: config.calendar.organizer
                };

                if (meeting.location) {
                    evendemy_event.location = meeting.location;
                }

                var txt = calendarService.createEvent(config.calendar, evendemy_event);
                attachment = {
                    "filename": "ical.ics",
                    "content": txt
                };
            }
        }
        
        mailService.sendMail(config, sendTo, view, attachment, production_mode);
    }

    function notifyAuthor(isNewAttendee, meeting, attendee) {
        console.log('notify', isNewAttendee, meeting, attendee);
        userService.getUserByUsername(meeting.username).then(function (author) {

            var view;
            if(isNewAttendee){
                view = mailService.renderAllTemplates(mailConfig.notificationMail.newAttendee, meeting, attendee);
            } else{
                view = mailService.renderAllTemplates(mailConfig.notificationMail.canceledAttendee, meeting, attendee);
            }

            mailService.sendMail(config, author.email, view, null, production_mode);

        }, function (err) {
            console.error('notify via mail: ' + meeting.username + err);
        });
    }

    server.put('/meeting_user/:mid/:username', function (req, res, next) {
        if (req.params.mid === undefined || req.params.username === undefined) {
            res.send(500, { error: 'no mid or username' });
            return;
        }

        if (req.params.tookPart) {
            meetingService.confirmUserForMeeting(req.params.mid, req.params.username).then(function (meeting_user) {
                res.send(meeting_user1);
            }, function (err) {
                return res.send(500, { error: err });
            });
        } else {
            meetingService.rejectUserFromMeeting(req.params.mid, req.params.username).then(function (meeting_user) {
                res.send(meeting_user1);
            }, function (err) {
                return res.send(500, { error: err });
            });
        }

        return next();
    });

    server.del('/meeting_user/:mid/:username', function (req, res, next) {
        if (req.params.mid === undefined || req.params.username === undefined) {
            return res.send(500, { error: 'No mid or username specified' });
        }

        meetingService.notAttendingToMeeting(req.params.mid, req.params.username).then(function (meeting_user) {
            //send mail to notify author
            meetingService.getMeeting(req.params.mid).then(function(meeting){
                if (meeting !== null) {
                    userService.getUserByUsername(req.params.username).then(function (user) {
                        notifyAuthor(false, meeting, user);
                    }, function (err) {
                        console.error('put of meeting_user, user not found to send mail: ' + req.params.username + err);
                    });
                }
            }, function(err){
                console.error('should have found deleted meeting so that author can be notified, mid:' + req.params.mid + ", can not send a mail");
            });

            res.send(meeting_user);
        }, function (err) {
            return res.send(500, { error: err });
        });

        return next();
    });

    server.post('/image/:mid', function (req, res, next) {
        if (!req.params.mid) {
            return res.send(500, { error: 'No mid' });
        }

        if (!req.params.data) {
            return res.send(500, { error: 'No image' });
        }

        imageService.save(req.params.mid, req.params.data, config).then(function () {
            res.send(req.params.data);
        }).catch(function (err) {
            console.log(err);
            res.send(500, { error: 'Image could not be saved.' });
        });

        return next();
    });

};