module.exports = {
    getAllUsers: function() {
        var User = require('../models/user');
        return User.find({}).where('deleted').eq(false).exec();
    },

    getUserByUsername: function(username) {
        var User = require('../models/user');
        username = username.toLowerCase();
        return User.findOne({ username: username }).where('deleted').eq(false).exec();
    },

    saveUser: function(user){
        var User = require('../models/user');
        var newUser = new User();
        newUser.username = user.uid.toLowerCase();
        newUser.email =user.mail;
        newUser.firstname = user.firstname;
        newUser.lastname = user.lastname;

        return newUser.save();
    },

    saveSettings: function(username, options){
        var User = require('../models/user');
        var updateAttributes = {};

        if(options.additional_info_visible!==null){
            updateAttributes['additional_info_visible'] = options.additional_info_visible;
        }

        if(options.summary_of_meetings_visible !== null) {
            updateAttributes['summary_of_meetings_visible'] = options.summary_of_meetings_visible;
        }

        return User.update({username: username }, { $set: {options: updateAttributes} }, { upsert: true });
    }

}