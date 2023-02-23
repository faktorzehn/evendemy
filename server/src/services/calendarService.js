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
        event.organizer({
            name: config.organizer.name,
            email: config.organizer.email
        });

		return cal.toString();
	},

	createICalAttachment: function(config, meeting){
		var attachment;

        if (meeting.startTime && meeting.endTime) {

            if (config.calendar !== null) {

                var summary = 'Evendemy: ' + meeting.title;
                if(meeting.shortDescription) {
                    summary += ' - ' + meeting.shortDescription;
                }

                var evendemy_event = {
                    start: meeting.startTime,
                    end: meeting.endTime,
                    timestamp: new Date(),
                    summary: summary,
                    location: meeting.location
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
