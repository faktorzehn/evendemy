module.exports = {

    getMeetings: function (options) {
        var moment = require('moment');
        var Meeting = require('../models/meeting');

        var showNotAnnounced = (options.showNotAnnounced === 'true');
        var showOld = (options.showOld === 'true');
        var showNew = (options.showNew === 'true');
        var filter = {};

        if (options.username !== undefined) {
            filter.username = options.username;
        }
        if (options.courseOrEvent !== undefined) {
            filter.courseOrEvent = options.courseOrEvent;
        }
        if (options.isFreetime !== undefined) {
            filter.isFreetime = (options.isFreetime === 'true');
        }

        if (showNew || showOld || showNotAnnounced) {
            filter['$or'] = [];
        }

        var currentDate;

        if (showNew) {
            currentDate = moment({ h: 0, m: 0, s: 0, ms: 0 }).toDate();
            filter.$or.push({ 'date': { '$gte': currentDate } });
        }

        if (showOld) {
            currentDate = moment({ h: 0, m: 0, s: 0, ms: 0 }).toDate();
            filter.$or.push({ 'date': { '$lt': currentDate } });
        }

        if (showNotAnnounced) {
            filter.$or.push({ 'date': null });
        }

        return new Promise(function (resolve, reject) {
            if (!showNew && !showNotAnnounced && !showOld) {
                resolve([]);
            } else {
                Meeting.find(filter).where('deleted').eq(false).sort('date').exec(function (err, meetings) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    var result = [];
                    for (var i = 0; i < meetings.length; i++) {
                        var meeting = meetings[i];
                        var add = true;
                        if (add) {
                            result.push(meeting);
                        }
                    }

                    resolve(result);
                });
            }
        });
    },

    getMeeting: function (mid) {
        return new Promise(function (resolve, reject) {
            var Meeting = require('../models/meeting');
            Meeting.findOne({ mid: mid }).where('deleted').eq(false).exec(function (err, meeting) {
                if (err) {
                    reject(err);
                    return;
                }

                if (meeting) {
                    resolve(meeting);
                }
                else {
                    reject('404');
                }
            });
        });
    },

    deleteMeeting: function (mid) {
        return new Promise(function (resolve, reject) {
            var Meeting = require('../models/meeting');

            if (mid === undefined) {
                reject('No mid specified');
            }

            Meeting.update({ mid: mid }, { $set: { deleted: true } }, { upsert: true }, function (err, meeting) {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(meeting);
            });

        });
    }

}