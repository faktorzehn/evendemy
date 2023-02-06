module.exports = {
	createEvent: function(config, cal_event) {
		var ical = require('ical-generator');
		
		var cal = ical({
			domain: config.domain,
			prodId: {company: config.company, product: config.product},
			name: config.name,
			method: 'request'
		});

		var event = cal.createEvent(cal_event);

		return cal.toString();
	},

	createICalAttachment: function(config, meeting){
		var attachment;

        if (meeting.startTime && meeting.endTime) {

            if (config.calendar !== null) {

                var evendemy_event = {
                    start: meeting.startTime,
                    end: meeting.endTime,
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
