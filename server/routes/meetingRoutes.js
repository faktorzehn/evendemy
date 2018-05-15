module.exports = function (server, config, production_mode) {
    var _ = require('underscore');
    var moment = require('moment');

    var Comment = require('../models/comment');
    var Meeting = require('../models/meeting');

    var imageService = require('../services/imageService');
    var userService = require('../services/userService');
    var meetingService = require('../services/meetingService');
    var mailService = require('../services/mailService');
    var calendarService = require('../services/calendarService');
    var diffService = require('../services/diffService');

    var mailConfig = require('../assets/mail-config.de');

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

    server.get('/meeting/:mid/calendar', function (req, res, next) {
        meetingService.getMeeting(req.params.mid).then(function (meeting) {
            const attachment =  calendarService.createICalAttachment(config, meeting);
            res.send(attachment);
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

    function notifyAllAttendingUsers(meeting, username, templates, text, iCal){
        meetingService.getAttendingUsersForMid(meeting.mid).then(function (meeting_users){
            promises = _.map(meeting_users, function(mu){ 
                return userService.getUserByUsername(mu.username);
            });

            Promise.all(promises).then(function(mappedUsers){
                userService.getUserByUsername(username).then(function(user){
                    var view = mailService.renderAllTemplates(templates, meeting, user, text);
                    var sendTo = getMailAdresses(mappedUsers);
                    mailService.sendMail(config, sendTo, view, iCal, production_mode);
                });
            });
        });
    }

    server.post('/meeting/:mid/comment', function (req, res, next) {
        meetingService.addComment(req.params.mid, req.params).then(function (meeting) {
            notifyAllAttendingUsers(meeting, req.user.uid, mailConfig.addCommentMail, req.params.text, null);
            res.send(meeting);
        }, function (err) {
            res.send(500, { error: err });
        })

        return next();
    });

    server.put('/meeting/:mid', function (req, res, next) {

        if (req.params.mid !== undefined) {
            meetingService.getMeeting(req.params.mid).then(function(oldMeeting){
                meetingService.updateMeeting(req.params.mid, req.params).then(function (meeting) {
                    var diffResult = diffService.diff(oldMeeting.toJSON(), meeting.toJSON());
                    if(diffResult['startTime']!= null || diffResult['endTime'] || diffResult['date']){
                        //something important changed
                        let text = '';
                        if(meeting.startTime && meeting.endTime){
                            text = meeting.startTime + '-' + meeting.endTime + ' - ';
                        }

                        if(meeting.date){
                            text += moment(meeting.date).format("MM.DD.YYYY");
                        }
                        
                        const iCal = calendarService.createICalAttachment(config, meeting);
                        notifyAllAttendingUsers(meeting, meeting.username, mailConfig.dateChangedMail, text, iCal);
                    }
                    res.send(meeting);
                }, function (err) {
                    return res.send(500, { error: err });
                });
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
        meetingService.getMeeting(req.params.mid).then(function (meeting) {
            notifyAllAttendingUsers(meeting, meeting.username, mailConfig.meetingDeleted, null, null);

            meetingService.deleteMeeting(req.params.mid).then(function (meeting) {
                res.send(meeting);
            }, function (err) {
                return res.send(500, { error: err });
            });
            
        });
    
        return next();
    });

    server.get('/meeting/:mid/attendees', function (req, res, next) {
        if (req.params.mid !== undefined) {
            meetingService.getAttendingUsersForMid(req.params.mid).then(function (meeting_users) {
                res.send(meeting_users);
            }, function (err) {
                res.send(500, { error: err });
            });
        } else {
            res.send(500, { error: 'no mid specified' });
            return;
        }

        return next();
    });

    server.put('/meeting/:mid/attendee/:username/attend', function (req, res, next) {

        if (req.params.mid === undefined || req.params.username === undefined ) {
            return res.send(500, { error: 'no mid or username' });
        }

        meetingService.attendingToMeeting(req.params.mid, req.params.username, req.params.externals).then(function (meeting_user) {
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

    server.del('/meeting/:mid/attendee/:username/attend', function (req, res, next) {

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

    server.put('/meeting/:mid/attendee/:username/confirm', function (req, res, next) {

        if (req.params.mid === undefined || req.params.username === undefined ) {
            return res.send(500, { error: 'no mid or username' });
        }

        meetingService.confirmUserForMeeting(req.params.mid, req.params.username).then(function (meeting_user) {
            res.send(meeting_user);
        }, function (err) {
            return res.send(500, { error: err });
        });

        return next();
    });

    server.del('/meeting/:mid/attendee/:username/confirm', function (req, res, next) {

        if (req.params.mid === undefined || req.params.username === undefined ) {
            return res.send(500, { error: 'no mid or username' });
        }

        meetingService.rejectUserFromMeeting(req.params.mid, req.params.username).then(function (meeting_user) {
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

        const attachment = calendarService.createICalAttachment(config, meeting);
        
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

    server.post('/meeting/:mid/image', function (req, res, next) {
        if (!req.params.mid) {
            return res.send(500, { error: 'No mid' });
        }

        if (!req.params.data) {
            return res.send(500, { error: 'No image' });
        }

        imageService.save(req.params.mid, req.params.data, config.meetingImageFolder).then(function () {
            res.send(req.params.data);
        }).catch(function (err) {
            console.log(err);
            res.send(500, { error: 'Image could not be saved.' });
        });

        return next();
    });
}