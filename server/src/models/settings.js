const mongoose = require('mongoose');
const IdentityCounters = require('./identitycounters');

const SettingsSchema = mongoose.Schema({
    _id: { type: Number, required: true, unique: true},
    username: {type: String, required: true, unique: true},
    summary_of_meetings_visible: {type: Boolean, default: false}
});

IdentityCounters.createIndex(SettingsSchema, 'Settings', '_id');
const Settings = mongoose.model('Settings', SettingsSchema);
module.exports = Settings; 