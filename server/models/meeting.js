const mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Comment = require('./comment');

const MeetingSchema = mongoose.Schema({
    mid: { type: Number, required: true },
    title: { type: String, default: '' },
    shortDescription: { type: String, default: '' },
    description: { type: String, default: '' },
    startTime: { type: String, default: '' },
    endTime: { type: String, default: '' },
    costCenter: { type: String, default: '' },
    location: { type: String, default: '' },
    courseOrEvent: { type: String, default: 'course' },
    isFreetime: { type: Boolean, default: false },
    date: { type: Date, default: null },
    creationDate: { type: Date, default: Date.now },
    username: { type: String, required: true }, //autor
    comments: { type: [Comment.schema], default: [] },
    deleted: { type: Boolean, default: false }
});

MeetingSchema.plugin(autoIncrement.plugin, {model:'Meeting', field: 'mid'});
const Meeting = mongoose.model('Meeting', MeetingSchema);
module.exports = Meeting; 