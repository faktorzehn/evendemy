var Schema = {
  getCommentSchema: function(mongoose){
    return mongoose.Schema({
      text: {type: String, default: ''},
      creationDate: {type: Date, default: Date.now},
      author: {type: String, required: true}
    });
  },
  getMeetingSchema: function(mongoose, commentSchema){
    return meetingSchema = mongoose.Schema({ //PK: mid or _id
        mid: {type: Number, required: true},
      	title: {type: String, default: ''},
        shortDescription: {type: String, default: ''},
        description: {type: String, default: ''},
        startTime: {type: String, default: ''},
        endTime: {type: String, default: ''},
        costCenter: {type: String, default: ''},
        location: {type: String, default: ''},
      	courseOrEvent: {type: String, default: 'course'},
      	isFreetime: {type: Boolean, default: false},
        date: {type: Date, default: null},
      	creationDate: {type: Date, default: Date.now},
      	username: {type: String, required: true}, //autor
        comments: {type: [commentSchema], default: []},
      	deleted: {type: Boolean, default: false}
    });
  },
  getUserSchema: function(mongoose){
    return mongoose.Schema({ //PK: username or _id
    	username: {type: String, required: true, unique: true},
    	firstname: {type: String, default: ''},
    	lastname: {type: String, default: ''},
         email: {type: String, default: ''},
    	deleted: {type: Boolean, default: false}
    });
  },
  getMeeting_userSchema: function(mongoose){
    return mongoose.Schema({ //PK (id and username) or _id
    	mid: {type: Number, required: true}, //meeting id
    	username: {type: String, required: true},
    	tookPart: {type: Boolean, default: false},
    	deleted: {type: Boolean, default: false}
    });
  }

};

module.exports = Schema;
