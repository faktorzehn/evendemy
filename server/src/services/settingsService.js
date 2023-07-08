module.exports = {

    getSettings: function(username) {
        var Settings = require('../models/settings');
        return Settings.findOne({username: username}).exec().then(settings => {
            if(settings) {
                return settings;
            }

            return {
                username: username,
                summary_of_meetings_visible: false
            }
        });
    },

    saveSettings: function(username, options){
        var Settings = require('../models/settings');
        var updateAttributes = {};

        if(options.summary_of_meetings_visible !== null && options.summary_of_meetings_visible !== undefined) {
            updateAttributes['summary_of_meetings_visible'] = options.summary_of_meetings_visible;
        }

        return Settings.update({username: username }, { $set: updateAttributes }, { upsert: true });
    }
}