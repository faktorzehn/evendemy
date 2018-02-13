const mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

const MeetingUserSchema = mongoose.Schema({
    mid: {type: Number, required: true}, //meeting id
    username: {type: String, required: true},
    tookPart: {type: Boolean, default: false},
    deleted: {type: Boolean, default: false}
});
MeetingUserSchema.plugin(autoIncrement.plugin, 'Meeting_User');
const MeetingUser = mongoose.model('Meeting_User', MeetingUserSchema);
module.exports = MeetingUser; 