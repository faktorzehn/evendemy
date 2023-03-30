const mongoose = require('mongoose');
var Comment = require('./comment');
const IdentityCounters = require('./identitycounters');

const MeetingSchema = mongoose.Schema({
    mid: { type: Number, required: true, unique: true},
    title: { type: String, default: '' },
    shortDescription: { type: String, default: '' },
    description: { type: String, default: '' },
    startTime: { type: Date, default: null },
    endTime: { type: Date, default: null },
    costCenter: { type: String, default: '' },
    location: { type: String, default: '' },
    courseOrEvent: { type: String, default: 'course' },
    isIdea:  { type: Boolean, default: false },
    isFreetime: { type: Boolean, default: false },
    creationDate: { type: Date, default: Date.now },
    lastUpdateDate: { type: Date, default: Date.now },
    username: { type: String, required: true },
    comments: { type: [Comment.schema], default: [] },
    numberOfAllowedExternals: { type: Number, default: 0},
    tags: {type:[String], default:[]},
    deleted: { type: Boolean, default: false },
    images: { type: [String], default: [] }
});

IdentityCounters.createIndex(MeetingSchema, 'Meeting', 'mid');
const Meeting = mongoose.model('Meeting', MeetingSchema);

module.exports = Meeting; 