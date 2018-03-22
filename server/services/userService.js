module.exports = {
    getAllUsers: function() {
        var User = require('../models/user');
        return User.find({}).where('deleted').eq(false).exec();
    },

    getUserByUsername: function(username) {
        var User = require('../models/user');
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
    }
}