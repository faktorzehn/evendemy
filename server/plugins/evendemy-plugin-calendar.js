var ical = require('ical-generator');
module.exports = function(config, cal_event) {
		var cal = ical({
		domain: config.domain,
		prodId: {company: config.company, product: config.product},
		name: config.name,
		timezone: config.timezone,
		method: 'request'
		});

		var event = cal.createEvent(cal_event);

		return cal.toString();
};
