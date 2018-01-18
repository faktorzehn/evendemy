module.exports = {
    getAllUsers: function() {
        var User = require('../models/user');
        return User.find({}).where('deleted').eq(false).exec();
    },

    getUserByUsername: function(username) {
        var User = require('../models/user');
        return User.findOne({ username: username }).where('deleted').eq(false).exec();
    }
}