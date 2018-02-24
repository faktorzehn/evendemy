module.exports = {
	createEvent: function(config, cal_event) {
		var ical = require('ical-generator');
		
		var cal = ical({
			domain: config.domain,
			prodId: {company: config.company, product: config.product},
			name: config.name,
			timezone: config.timezone,
			method: 'request'
		});

		var event = cal.createEvent(cal_event);

		return cal.toString();
	},

	createICalAttachment: function(config, meeting){
		var attachment;
		var moment = require('moment');

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

                var txt = this.createEvent(config.calendar, evendemy_event);
                attachment = {
                    "filename": "ical.ics",
                    "content": txt
                };
            }
        }

        return attachment;
    }
};
