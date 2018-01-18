module.exports = function (server, config) {

    var fs = require('fs');
    var nodemailer = require('nodemailer');
    var mustache = require('mustache');
    var _ = require('underscore');
    var moment = require('moment');


    var Comment = require('../models/comment');
    var Meeting = require('../models/meeting');
    var MeetingUser = require('../models/meeting_user');

    var imageService = require('../services/imageService');
    var userService = require('../services/userService');
    var meetingService = require('../services/meetingService');

    server.get('/ping', function (req, res, next) {
        res.send('ping');
        return next();
    });

    server.post('/auth', function (req, res, next) {
        userService.saveUser(req.user).then(function(){
            res.send(true);
        });

        return next();
    });

    server.get('/auth', function (req, res, next) {
        res.send(req.user);
        return next();
    });

    server.get('/user/:username', function (req, res, next) {

        userService.getUserByUsername(req.params.username).then(function(user){
            if (user !== null) {
                res.send(user);
            }
            else {
                res.send(404, { error: "No user found"});
            }
        }, function (err){
            return res.send(500, { error: err });
        });

        return next();
    });

    server.get('/meeting', function (req, res, next) {
        meetingService.getMeetings(req.params).then(function(meetings){
            res.send(meetings);
        }, function(err){
            return res.send(500, { error: err });
        });

        return next();
    });

    server.get('/meeting/:mid', function (req, res, next) {
        meetingService.getMeeting(req.params.mid).then(function(meeting){
            res.send(meeting);
        }, function(err){
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
        var meeting1 = new Meeting();
        if (req.params.title !== undefined) {
            meeting1.title = req.params.title;
        }
        if (req.params.shortDescription !== undefined) {
            meeting1.shortDescription = req.params.shortDescription;
        }
        if (req.params.description !== undefined) {
            meeting1.description = req.params.description;
        }
        if (req.params.startTime !== undefined) {
            meeting1.startTime = req.params.startTime;
        }
        if (req.params.endTime !== undefined) {
            meeting1.endTime = req.params.endTime;
        }
        if (req.params.location !== undefined) {
            meeting1.location = req.params.location;
        }
        if (req.params.costCenter !== undefined) {
            meeting1.costCenter = req.params.costCenter;
        }
        if (req.params.courseOrEvent !== undefined) {
            meeting1.courseOrEvent = req.params.courseOrEvent;
        }
        if (req.params.isFreetime !== undefined) {
            meeting1.isFreetime = req.params.isFreetime;
        }
        if (req.params.date !== undefined) {
            meeting1.date = req.params.date;
        }
        meeting1.username = req.username;
        meeting1.save(function (err, meeting1) {
            if (err) {
                return res.send(500, { error: err });
            }

            //inform all users about the new meeting entry
            userService.getAllUsers().then(function (users) {
                var view = {
                    title: mustache.render(config.mail.informAllMail.title, { meeting1 }),
                    body: mustache.render(config.mail.informAllMail.body, { meeting1 }),
                    button_href: mustache.render(config.mail.informAllMail.button_href, { meeting1 }),
                    button_label: mustache.render(config.mail.informAllMail.button_label, { meeting1 }),
                    foot: mustache.render(config.mail.informAllMail.foot, { meeting1 })
                };
                var sendTo = getMailAdresses(users);

                sendMail(sendTo, mustache.render(config.mail.informAllMail.header, { meeting1 }), view);
            }, function (err) {
                return res.send(500, { error: err });
            });
            res.send(meeting1);
        });
        return next();
    });

    server.post('/addComment/:mid', function (req, res, next) {
        Meeting.findOne({ mid: req.params.mid }).where('deleted').eq(false).exec(function (err, meeting) {
            if (err) {
                return res.send(500, { error: err });
            }

            if (meeting === null) {
                console.log('meeting is null');
            }

            if (meeting !== null && req.params.text) {
                var comment = new Comment();
                comment.text = req.params.text;
                comment.author = req.params.author;
                if (!meeting.comments) {
                    meeting.comments = [];
                }
                meeting.comments.push(comment);

                meeting.save(function (err, meeting1) {
                    if (err) {
                        return res.send(500, { error: err });
                    }
                    res.send(meeting1);
                });
            }
            else {
                res.send({});
            }
        });
        return next();
    });

    server.put('/meeting/:mid', function (req, res, next) {

        if (req.params.mid !== undefined) {
            var updateMeeting = {};
            if (req.params.title !== undefined) {
                updateMeeting.title = req.params.title;
            }
            if (req.params.shortDescription !== undefined) {
                updateMeeting.shortDescription = req.params.shortDescription;
            }
            if (req.params.description !== undefined) {
                updateMeeting.description = req.params.description;
            }
            if (req.params.startTime !== undefined) {
                updateMeeting.startTime = req.params.startTime;
            }
            if (req.params.endTime !== undefined) {
                updateMeeting.endTime = req.params.endTime;
            }
            if (req.params.location !== undefined) {
                updateMeeting.location = req.params.location;
            }
            if (req.params.costCenter !== undefined) {
                updateMeeting.costCenter = req.params.costCenter;
            }
            if (req.params.courseOrEvent !== undefined) {
                updateMeeting.courseOrEvent = req.params.courseOrEvent;
            }
            if (req.params.isFreetime !== undefined) {
                updateMeeting.isFreetime = req.params.isFreetime;
            }
            if (req.params.date !== undefined) {
                updateMeeting.date = req.params.date;
            }

            Meeting.update({ mid: req.params.mid }, { $set: updateMeeting }, { upsert: true }, function (err, meeting1) {
                if (err) {
                    return res.send(500, { error: err });
                }

                res.send(meeting1);
            });
        }
        else {
            return res.send(500, { error: 'No mid specified' });
        }

        return next();
    });

    server.del('/meeting/:mid', function (req, res, next) {

        if (req.params.mid !== undefined) {
            Meeting.update({ mid: req.params.mid }, { $set: { deleted: true } }, { upsert: true }, function (err, meeting1) {
                if (err) {
                    return res.send(500, { error: err });
                }
                res.send(meeting1);
            });
        }
        else {
            return res.send(500, { error: 'No mid specified' });
        }

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

    server.post('/meeting_user', function (req, res, next) {

        var meeting_user1 = new MeetingUser();
        if (req.params.mid !== undefined && req.params.username !== undefined) {
            meeting_user1.mid = req.params.mid;
            meeting_user1.username = req.params.username;
            if (req.params.tookPart !== undefined) {
                meeting_user1.tookPart = req.params.tookPart;
            }
            meeting_user1.save(function (err, meeting_user1) {
                if (err) {
                    return res.send(500, { error: err });
                }

                //send mail to the new attendee
                Meeting.findOne({ mid: req.params.mid }).where('deleted').eq(false).exec(function (err, meeting) {
                    if (err) {
                        console.error('post of meeting_user, meeting not found with mid:' + req.params.mid + ", can not send a mail");
                    } else {
                        if (meeting !== null) {
                            userService.getUserByUsername(req.params.username).then(function (user) {
                                confirmAttendee(meeting, user);
                                notifyAuthorNewAttendee(meeting, user);
                            }, function (err) {
                                console.error('post of meeting_user, user not found to send mail: ' + req.params.username + err);
                            });
                        }
                    }
                });

                res.send(meeting_user1);
            });
        } else {
            return res.send(500, { error: 'No mid or username specified' });
        }
        return next();
    });

    function confirmAttendee(meeting, user) {

        var message = "";
        if (meeting.date && meeting.startTime && meeting.endTime) {
            message = mustache.render(config.mail.confirmMail.body, { meeting, user });
        } else {
            message = mustache.render(config.mail.confirmMail.body_no_calendar, { meeting, user });
        }

        var view = {
            title: mustache.render(config.mail.confirmMail.title, { meeting, user }),
            body: message,
            button_href: mustache.render(config.mail.confirmMail.button_href, { meeting, user }),
            button_label: mustache.render(config.mail.confirmMail.button_label, { meeting, user }),
            foot: mustache.render(config.mail.confirmMail.foot, { meeting, user })
        };

        var sendTo = user.email;

        //create cal attachment
        var attachments = [];

        if (meeting.date && meeting.startTime && meeting.endTime) {
            var evendemy_plugin = require('../plugins/evendemy-plugin-calendar');

            var startDate = moment(meeting.date);
            var time = meeting.startTime.split(':');
            startDate.hour(time[0]);
            startDate.minute(time[1]);

            var endDate = moment(meeting.date);
            time = meeting.endTime.split(':');
            endDate.hour(time[0]);
            endDate.minute(time[1]);

            var evendemy_plugin_config = getPluginConfig('evendemy-plugin-calendar');

            if (evendemy_plugin !== null && evendemy_plugin_config !== null) {

                var evendemy_event = {
                    start: startDate.toDate(),
                    end: endDate.toDate(),
                    timestamp: new Date(),
                    summary: 'Evendemy:' + meeting.title,
                    organizer: evendemy_plugin_config.organizer
                };

                if (meeting.location) {
                    evendemy_event.location = meeting.location;
                }

                var txt = evendemy_plugin(evendemy_plugin_config, evendemy_event);
                attachments.push({
                    "filename": "ical.ics",
                    "content": txt
                });
            }
        }
        sendMail(sendTo, mustache.render(config.mail.confirmMail.header, { meeting, user }), view, attachments);
    }

    function notifyAuthorNewAttendee(meeting, attendee) {
        userService.getUserByUsername(meeting.username).then(function (author) {

            var view_notify_author = {
                title: mustache.render(config.mail.notificationMail.newAttendee.title, { meeting, attendee }),
                body: mustache.render(config.mail.notificationMail.newAttendee.body, { meeting, attendee }),
                button_href: mustache.render(config.mail.notificationMail.newAttendee.button_href, { meeting, attendee }),
                button_label: mustache.render(config.mail.notificationMail.newAttendee.button_label, { meeting, attendee }),
                foot: mustache.render(config.mail.notificationMail.newAttendee.foot, { meeting, attendee })
            };

            sendMail(author.email, mustache.render(config.mail.notificationMail.newAttendee.header, { meeting, attendee }), view_notify_author);

        }, function (err) {
            console.error('notify via mail: ' + meeting.username + err);
        });
    }
    function notifyAuthorCanceledAttendee(meeting, attendee) {
        userService.getUserByUsername(meeting.username).then(function (author) {

            var view_notify_author = {
                title: mustache.render(config.mail.notificationMail.canceledAttendee.title, { meeting, attendee }),
                body: mustache.render(config.mail.notificationMail.canceledAttendee.body, { meeting, attendee }),
                button_href: mustache.render(config.mail.notificationMail.canceledAttendee.button_href, { meeting, attendee }),
                button_label: mustache.render(config.mail.notificationMail.canceledAttendee.button_label, { meeting, attendee }),
                foot: mustache.render(config.mail.notificationMail.canceledAttendee.foot, { meeting, attendee })
            };

            sendMail(author.email, mustache.render(config.mail.notificationMail.canceledAttendee.header, { meeting, attendee }), view_notify_author);

        }, function (err) {
            console.error('notify via mail: ' + meeting.username + err);
        });
    }

    server.put('/meeting_user/:mid/:username', function (req, res, next) {

        if (req.params.mid !== undefined && req.params.username !== undefined) {
            var updateMeeting_User = {};
            if (req.params.tookPart !== undefined) {
                updateMeeting_User.tookPart = req.params.tookPart;
            }
            MeetingUser.update({ $and: [{ mid: req.params.mid }, { username: req.params.username }, { deleted: false }] }, { $set: updateMeeting_User }, { upsert: true }, function (err, meeting_user1) {
                if (err) {
                    return res.send(500, { error: err });
                }
                res.send(meeting_user1);
            });
        }
        else {
            return res.send(500, { error: 'No mid or username specified' });
        }

        return next();
    });

    server.del('/meeting_user/:mid/:username', function (req, res, next) {
        if (req.params.mid !== undefined && req.params.username !== undefined) {
            MeetingUser.update({ $and: [{ mid: req.params.mid }, { username: req.params.username }, { deleted: false }] }, { $set: { deleted: true } }, { upsert: true }, function (err, meeting_user1) {
                if (err) {
                    return res.send(500, { error: err });
                }

                //send mail to notify author
                Meeting.findOne({ mid: req.params.mid }).where('deleted').eq(false).exec(function (err, meeting) {
                    if (err) {
                        console.error('should have found deleted meeting so that author can be notified, mid:' + req.params.mid + ", can not send a mail");
                    } else {
                        if (meeting !== null) {
                            userService.getUserByUsername(req.params.username).then(function (user) {
                                notifyAuthorCanceledAttendee(meeting, user);
                            }, function (err) {
                                console.error('put of meeting_user, user not found to send mail: ' + req.params.username + err);
                            });
                        }
                    }
                });


                res.send(meeting_user1);
            });
        }
        else {
            return res.send(500, { error: 'No mid or username specified' });
        }

        return next();
    });

    function getPluginConfig(plugin_name) {
        if (config && config.plugins) {
            for (var i = 0; i < config.plugins.length; i++) {
                if (config.plugins[i].name == plugin_name) {
                    return config.plugins[i].config;
                }
            }
        }
        return null;
    }


    function sendMail(sendTo, title, view, attachments) {
        console.log('sending mail');
        if (!config.mail || !config.mail.enableMail || config.mail.enableMail === false) {
            console.log('There is no configuration for sending mails. The email will not be sent.');
            return;
        }


        fs.readFile(config.mail.htmlFilePath, 'utf8', function (err, template) {
            if (err) {
                return console.log(err);
            }

            var html = mustache.render(template, view);

            var smtpConfig = {
                host: config.mail.host,
                port: config.mail.port,
                secureConnection: false,
                auth: {
                    user: config.mail.user,
                    pass: config.mail.pass
                },
                tls: {
                    ciphers: 'SSLv3'
                }
            };

            var transporter = nodemailer.createTransport(smtpConfig);

            var mailOptions = {
                from: config.mail.address, // sender address
                bcc: sendTo, // list of receivers
                subject: title, // Subject line
                html: html
            };

            if (attachments && attachments.length > 0) {
                mailOptions.attachments = attachments;
            }

            // send mail with defined transport object
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    return console.log(error);
                }
                console.log('Message sent: ' + info.response);
            });

        });
    }

    server.post('/image/:mid', function (req, res, next) {
        if (!req.params.mid) {
            return res.send(500, { error: 'No mid' });
        }

        if (!req.params.data) {
            return res.send(500, { error: 'No image' });
        }

        imageService.save(req.params.mid, req.params.data, config).then(function(){
            res.send(req.params.data);
        }).catch(function (err) {
            console.log(err);
            res.send(500, { error: 'Image could not be saved.' });
        });
        
        return next();
    });

};