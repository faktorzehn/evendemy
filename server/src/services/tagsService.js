module.exports = {

    getAllTags: () => {
        var Meeting = require('../models/meeting');
        return Meeting.find({}).where('deleted').eq(false).distinct('tags').exec();
    }
}