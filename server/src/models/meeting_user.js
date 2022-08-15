const mongoose = require('mongoose');

const MeetingUserSchema = mongoose.Schema({
    mid: {type: Number, required: true},
    username: {type: String, required: true},
    tookPart: {type: Boolean, default: false},
    dateOfRegistration: {type: Date},
    dateOfConfirmation: {type: Date},
    externals: { type: [String], default: [] },
    deleted: {type: Boolean, default: false}
});

const MeetingUser = mongoose.model('Meeting_User', MeetingUserSchema);
module.exports = MeetingUser; 