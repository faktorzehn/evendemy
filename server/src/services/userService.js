module.exports = {
    getAllUsers: function() {
        var User = require('../models/user');
        return User.find({}, ['username', 'firstname', 'lastname', 'avatar', 'email']).where('deleted').sort({lastname: 1, firstname: 1}).eq(false).exec();
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

    saveAdditionalInfo: function(username, info){
        var User = require('../models/user');
        var updateAttributes = {};

        if(info.job_title){
            updateAttributes['job_title'] = info.job_title;
        }

        if(info.description){
            updateAttributes['description'] = info.description;
        }

        if(info.instagram_username){
            updateAttributes['instagram_username'] = info.instagram_username;
        }

        if(info.facebook_username){
            updateAttributes['facebook_username'] = info.facebook_username;
        }

        if(info.twitter_username){
            updateAttributes['twitter_username'] = info.twitter_username;
        }

        if(info.birthday){
            updateAttributes['birthday'] = info.birthday;
        }

        return User.update({username: username }, { $set: {additional_info: updateAttributes} }, { upsert: true });
    }

}