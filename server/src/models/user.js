const mongoose = require('mongoose');
const IdentityCounters = require('./identitycounters');

const UserSchema = mongoose.Schema({
    _id: { type: Number, required: true, unique: true},
    username: {type: String, required: true, unique: true},
    firstname: {type: String, default: ''},
    lastname: {type: String, default: ''},
    email: {type: String, default: ''},
    deleted: {type: Boolean, default: false},
    avatar: {type: Boolean, default: false},
    options: {
        additional_info_visible: {type: Boolean, default: false},
        summary_of_meetings_visible: {type: Boolean, default: false}
    },
    additional_info: {
        job_title: {type: String, default: ''},
        description:  {type: String, default: ''},
        instagram_username: {type: String, default: ''},
        facebook_username: {type: String, default: ''},
        twitter_username: {type: String, default: ''},
        birthday: { type: Date, default: Date.now }
    }
});

IdentityCounters.createIndex(UserSchema, 'User', '_id');
const User = mongoose.model('User', UserSchema);
module.exports = User; 