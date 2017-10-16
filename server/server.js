var restify = require('restify');
var mongoose = require('mongoose');
var corsMiddleware = require('restify-cors-middleware');
var autoIncrement = require('mongoose-auto-increment');
var config = require('./config');
var auth = require('./auth.js');
var schemas = require('./schemas.js');
var fs = require('fs');
var nodemailer = require('nodemailer');
var mustache = require('mustache');
var _ = require('underscore');
var moment = require('moment');

//load config for production mode or development and log it
try{
  var developer_config = require('./developer-config');
  if(developer_config){
    console.warn('ATTENTION: You are using the developer - not production mode.');
    console.warn('If you dont want developer mode: Please delete developer-config.json and restart this server.');
    production_mode = false;
    config = developer_config;
  }
}catch(e){
  console.warn('No developer config found. Production mode!');
}

//set cors
var cors = corsMiddleware({
    allowHeaders: ['Authorization']
});

//init mongo db
var db = mongoose.connect(config.db.url);
autoIncrement.initialize(db);

var commentSchema = schemas.getCommentSchema(mongoose);
var Comment = mongoose.model('Comment', commentSchema);

var meetingSchema = schemas.getMeetingSchema(mongoose, commentSchema);
meetingSchema.plugin(autoIncrement.plugin, {model:'Meeting', field: 'mid'});
var Meeting = mongoose.model('Meeting', meetingSchema);

var userSchema = schemas.getUserSchema(mongoose);
userSchema.plugin(autoIncrement.plugin, 'User');
var User = mongoose.model('User',userSchema);

var meeting_userSchema = schemas.getMeeting_userSchema(mongoose);
meeting_userSchema.plugin(autoIncrement.plugin, 'Meeting_User');
var Meeting_User = mongoose.model('Meeting_User',meeting_userSchema);

//config for restify server
var serverconfig = config.serverconfig;
var serverObj = {};
if(serverconfig.name){
	serverObj['name']=serverconfig.name;
}
if(serverconfig.certificatePath){
	serverObj['certificate']=fs.readFileSync(serverconfig.certificatePath);
}
if(serverconfig.keyPath){
	serverObj['key']=fs.readFileSync(serverconfig.keyPath);
}
var server = restify.createServer(serverObj);

server.pre(cors.preflight);
server.use(cors.actual);
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser({"mapFiles":true}));
server.use(restify.authorizationParser());
server.use(auth(config));
server.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});

server.listen(40274, function () {
    console.log('Server started @ 40274');
});

server.get('/ping', function (req, res, next) {
     res.send('ping');
     return next();
});

server.post('/auth', function (req, res, next) {
     var user1 = new User();
     user1.username = req.user.uid;
     user1.email = req.user.mail;
     user1.firstname = req.user.firstname;
     user1.lastname = req.user.lastname;

     user1.save(function(err,user1) {
          res.send(true);
     });

     return next();
});

server.get('/auth', function (req, res, next) {
     res.send(req.user);
     return next();
});

function getUsers(){
	return User.find({}).where('deleted').eq(false).exec();
}

function getUser(username){
	return 	User.findOne({username: username}).where('deleted').eq(false).exec();
}

function getMailAdresses(dbUsers){
	if(!dbUsers){
		return [];
	}
	return _.map(dbUsers, function(x){return x.email;})
}

server.get('/user', function (req, res, next) {

	getUsers().then(function(users) {
		res.send(users);
	}, function(err){
		return res.send(500, { error: err });
	});

    return next();
});

server.get('/user/:username', function (req, res, next) {

	User.findOne({username: req.params.username}).where('deleted').eq(false).exec(function(err,user) {
		if(err) {
			return res.send(500, { error: err });
		}
		if(user !== null) {
			res.send(user);
		}
		else {
			res.send({});
		}
	});
    return next();
});

server.put('/user/:username', function (req, res, next) {

	if(req.params.username !== undefined) {
		var updateUser = {};
		if(req.params.firstname !== undefined) {
			updateUser.firstname = req.params.firstname;
		}
		if(req.params.lastname !== undefined) {
			updateUser.lastname = req.params.lastname;
		}
    if(req.params.email !== undefined) {
			updateUser.email = req.params.email;
		}

		User.update({username:req.params.username},{$set: updateUser},{upsert:true},function(err,user1) {
			if(err) {
				return res.send(500, { error: err });
			}
			res.send(user1);
		});
	}
	else {
		return res.send(500, {error:'No username specified'});
	}

    return next();
});

server.del('/user/:username', function (req, res, next) {

     if(req.params.username !== undefined) {
          User.update({username:req.params.username},{$set: {deleted: true}},{upsert:true},function(err,user1) {
               if(err) {
                    return res.send(500, { error: err });
               }
               res.send(user1);
          });
	}
	else {
		return res.send(500, {error:'No id specified'});
	}

    return next();
});

server.get('/meeting', function (req, res, next) {

	var retArray = [];
	var showNotAnnounced = (req.params.showNotAnnounced === 'true');
	var showOld = (req.params.showOld === 'true');
	var showNew = (req.params.showNew === 'true');
	var filter = {};

	if(req.params.username !== undefined) {
		filter.username = req.params.username;
	}
	if(req.params.courseOrEvent !== undefined) {
		filter.courseOrEvent = req.params.courseOrEvent;
	}
	if(req.params.isFreetime !== undefined) {
		filter.isFreetime = (req.params.isFreetime === 'true');
	}

	if(showNew || showOld || showNotAnnounced){
			filter['$or'] = [];
	}

  var currentDate;

	if(showNew){
		currentDate = moment({h:0, m:0, s:0, ms:0}).toDate();
		filter.$or.push({'date': {'$gte' : currentDate}});
	}

	if(showOld){
		currentDate = moment({h:0, m:0, s:0, ms:0}).toDate();
		filter.$or.push({'date': {'$lt' : currentDate}});
	}

	if(showNotAnnounced){
		filter.$or.push({'date': null});
	}

	Meeting.find(filter).where('deleted').eq(false).sort('date').exec(function(err,meetings) {
		if(err) {
			return res.send(500, { error: err });
		}
		for(var i=0;i<meetings.length;i++) {
			var meeting = meetings[i];
			var add = true;
			if(add) {
				retArray.push(meeting);
			}
		}

		res.send(retArray);
	});

    return next();
});

server.get('/meeting/:mid', function (req, res, next) {

	Meeting.findOne({mid: req.params.mid}).where('deleted').eq(false).exec(function(err,meeting) {
		if(err) {
			return res.send(500, { error: err });
		}

		if(meeting !== null) {
			res.send(meeting);
		}
		else {
			res.send({});
		}
	});
    return next();
});

server.post('/meeting', function (req, res, next) {
	var meeting1 = new Meeting();
	if(req.params.title !== undefined) {
		meeting1.title = req.params.title;
	}
	if(req.params.shortDescription !== undefined) {
	  meeting1.shortDescription = req.params.shortDescription;
	}
	if(req.params.description !== undefined) {
		meeting1.description = req.params.description;
	}
	if(req.params.startTime !== undefined) {
		meeting1.startTime = req.params.startTime;
	}
	if(req.params.endTime !== undefined) {
		meeting1.endTime = req.params.endTime;
	}
  if(req.params.location !== undefined) {
    meeting1.location = req.params.location;
  }
	if(req.params.costCenter !== undefined) {
		meeting1.costCenter = req.params.costCenter;
	}
	if(req.params.courseOrEvent !== undefined) {
		meeting1.courseOrEvent = req.params.courseOrEvent;
	}
	if(req.params.isFreetime !== undefined) {
		meeting1.isFreetime = req.params.isFreetime;
	}
	if(req.params.date !== undefined) {
		meeting1.date = req.params.date;
	}
	meeting1.username = req.username;
	meeting1.save(function(err,meeting1) {
		if(err) {
			return res.send(500, { error: err });
		}

    //inform all users about the new meeting entry
		getUsers().then(function(users) {
			var view = {
			  title: mustache.render(config.mail.informAllMail.title, {meeting1}),
			  body: mustache.render(config.mail.informAllMail.body, {meeting1}),
			  button_href: mustache.render(config.mail.informAllMail.button_href, {meeting1}),
			  button_label: mustache.render(config.mail.informAllMail.button_label, {meeting1}),
			  foot: mustache.render(config.mail.informAllMail.foot, {meeting1})
			};
			var sendTo = getMailAdresses(users);

			sendMail(sendTo, mustache.render(config.mail.informAllMail.header, {meeting1}), view);
		}, function(err){
			return res.send(500, { error: err });
		});
		res.send(meeting1);
	});
    return next();
});

server.post('/addComment/:mid', function (req, res, next) {
  Meeting.findOne({mid: req.params.mid}).where('deleted').eq(false).exec(function(err,meeting) {
		if(err) {
			return res.send(500, { error: err });
		}

    if(meeting === null){
      console.log('meeting is null');
    }

		if(meeting !== null && req.params.text) {
      var comment = new Comment();
      comment.text= req.params.text;
      comment.author=req.params.author;
      if(!meeting.comments){
        meeting.comments=[];
      }
      meeting.comments.push(comment);

      meeting.save(function(err,meeting1) {
        if(err) {
          return res.send(500, { error: err });
        }
        res.send(meeting1);
      });
		}
		else {
			res.send({});
		}
	});
  return next();
});

server.put('/meeting/:mid', function (req, res, next) {

	if(req.params.mid !== undefined) {
		var updateMeeting = {};
    if(req.params.title !== undefined) {
  		updateMeeting.title = req.params.title;
  	}
    if(req.params.shortDescription !== undefined) {
      updateMeeting.shortDescription = req.params.shortDescription;
    }
    if(req.params.description !== undefined) {
  		updateMeeting.description = req.params.description;
  	}
    if(req.params.startTime !== undefined) {
      updateMeeting.startTime = req.params.startTime;
    }
    if(req.params.endTime !== undefined) {
      updateMeeting.endTime = req.params.endTime;
    }
    if(req.params.location !== undefined) {
      updateMeeting.location = req.params.location;
    }
    if(req.params.costCenter !== undefined) {
      updateMeeting.costCenter = req.params.costCenter;
    }
		if(req.params.courseOrEvent !== undefined) {
			updateMeeting.courseOrEvent = req.params.courseOrEvent;
		}
		if(req.params.isFreetime !== undefined) {
			updateMeeting.isFreetime = req.params.isFreetime;
		}
		if(req.params.date !== undefined) {
			updateMeeting.date = req.params.date;
		}

		Meeting.update({mid:req.params.mid},{$set: updateMeeting},{upsert:true},function(err,meeting1) {
			if(err) {
				return res.send(500, { error: err });
			}

			res.send(meeting1);
		});
	}
	else {
		return res.send(500, {error:'No mid specified'});
	}

    return next();
});

server.del('/meeting/:mid', function (req, res, next) {

	if(req.params.mid !== undefined) {
		Meeting.update({mid:req.params.mid},{$set: {deleted: true}},{upsert:true},function(err,meeting1) {
			if(err) {
				return res.send(500, { error: err });
			}
			res.send(meeting1);
		});
	}
	else {
		return res.send(500, {error:'No mid specified'});
	}

    return next();
});

server.get('/meeting_user', function (req, res, next) {

	var filter = {};

	if(req.params.mid !== undefined) {
		filter.mid = req.params.mid;
	}
	if(req.params.username !== undefined) {
		filter.username = req.params.username;
	}
	if(req.params.tookPart !== undefined) {
		filter.tookPart = (req.params.tookPart === 'true');
	}

	Meeting_User.find(filter).where('deleted').eq(false).exec(function(err,meeting_users) {
		if(err) {
			return res.send(500, { error: err });
		}

		res.send(meeting_users);
	});

    return next();
});

server.get('/meeting_user/:mid/:username', function (req, res, next) {

	var filter = {};

	if(req.params.mid !== undefined) {
		filter.mid = req.params.mid;
	}
	if(req.params.username !== undefined) {
		filter.username = req.params.username;
	}
	if(req.params.tookPart !== undefined) {
		filter.tookPart = (req.params.tookPart === 'true');
	}

	Meeting_User.find(filter).where('deleted').eq(false).exec(function(err,meeting_users) {
		if(err) {
			return res.send(500, { error: err });
		}

		res.send(meeting_users);
	});

    return next();
});

server.post('/meeting_user', function (req, res, next) {

	var meeting_user1 = new Meeting_User();
	if(req.params.mid !== undefined && req.params.username !== undefined) {
		meeting_user1.mid = req.params.mid;
		meeting_user1.username = req.params.username;
		if(req.params.tookPart !== undefined) {
			meeting_user1.tookPart = req.params.tookPart;
		}
    meeting_user1.save(function(err,meeting_user1) {
     		if(err) {
     			return res.send(500, { error: err });
     		}

        //send mail to the new attendee
        Meeting.findOne({mid: req.params.mid}).where('deleted').eq(false).exec(function(err,meeting) {
        		if(err) {
        			console.error('post of meeting_user, meeting not found with mid:'+req.params.mid+", can not send a mail");
        		}else{
        		if(meeting !== null) {
                getUser(req.params.username).then(function(user){
                    confirmAttendee(meeting, user);
                    notifyAuthor(meeting, user);
                }, function(err){
                    console.error('post of meeting_user, user not found to send mail: '+req.params.username + err);
                });
            }
      		}
      	});

     		res.send(meeting_user1);
    });
  }else {
		return res.send(500, {error:'No mid or username specified'});
	}
    return next();
});

function confirmAttendee(meeting, user){

  var message = "";
  if(meeting.date && meeting.startTime && meeting.endTime){
    message = mustache.render(config.mail.confirmMail.body, {meeting, user});
  }else{
		message = mustache.render(config.mail.confirmMail.body_no_calendar, {meeting, user});
	}

  var view = {
    title: mustache.render(config.mail.confirmMail.title, {meeting, user}),
    body: message,
    button_href: mustache.render(config.mail.confirmMail.button_href, {meeting, user}),
    button_label: mustache.render(config.mail.confirmMail.button_label, {meeting, user}),
    foot: mustache.render(config.mail.confirmMail.foot, {meeting, user})
  };

  var sendTo = user.email;

  //create cal attachment
  var attachments=[];

  if(meeting.date && meeting.startTime && meeting.endTime){
    var evendemy_plugin = require('./plugins/evendemy-plugin-calendar');

    var startDate = moment(meeting.date);
    var time = meeting.startTime.split(':');
    startDate.hour(time[0]);
    startDate.minute(time[1]);

    var endDate= moment(meeting.date);
    time = meeting.endTime.split(':');
    endDate.hour(time[0]);
		endDate.minute(time[1]);
		
		var evendemy_plugin_config = getPluginConfig('evendemy-plugin-calendar');

		if(evendemy_plugin !== null && evendemy_plugin_config!== null){

			var evendemy_event = {
				start: startDate.toDate(),
				end: endDate.toDate(),
				timestamp: new Date(),
				summary: 'Evendemy:'+meeting.title,
				organizer: evendemy_plugin_config.organizer
			};

			if(meeting.location){
				evendemy_event.location=meeting.location;
			}

    	var txt = evendemy_plugin(evendemy_plugin_config, evendemy_event);
      attachments.push({
        "filename": "ical.ics",
        "content": txt
      });
    }
  }
  sendMail(sendTo, mustache.render(config.mail.confirmMail.header, {meeting, user}), view, attachments);
}

function notifyAuthor(meeting, attendee){
  getUser(meeting.username).then(function(author){

    var view_notify_author = {
			title: mustache.render(config.mail.notificationMail.title, {meeting, attendee}),
			body: mustache.render(config.mail.notificationMail.body, {meeting, attendee}),
			button_href: mustache.render(config.mail.notificationMail.button_href, {meeting, attendee}),
			button_label: mustache.render(config.mail.notificationMail.button_label, {meeting, attendee}),
			foot: mustache.render(config.mail.notificationMail.foot, {meeting, attendee})
    };

    sendMail(author.email, mustache.render(config.mail.notificationMail.header, {meeting, attendee}), view_notify_author);

  }, function(err){
      console.error('post of meeting_user, user not found to notify via mail: '+meeting.username + err);
  });
}

server.put('/meeting_user/:mid/:username', function (req, res, next) {

	if(req.params.mid !== undefined && req.params.username !== undefined) {
		var updateMeeting_User = {};
		if(req.params.tookPart !== undefined) {
			updateMeeting_User.tookPart = req.params.tookPart;
		}
		Meeting_User.update({$and:[{mid:req.params.mid},{username: req.params.username},{deleted: false}]},{$set: updateMeeting_User},{upsert:true},function(err,meeting_user1) {
			if(err) {
				return res.send(500, { error: err });
			}
			res.send(meeting_user1);
		});
	}
	else {
		return res.send(500, {error:'No mid or username specified'});
	}

    return next();
});

server.del('/meeting_user/:mid/:username', function (req, res, next) {
	if(req.params.mid !== undefined && req.params.username !== undefined) {
		Meeting_User.update({$and:[{mid:req.params.mid},{username: req.params.username},{deleted: false}]},{$set: {deleted: true}},{upsert:true},function(err,meeting_user1) {
			if(err) {
				return res.send(500, { error: err });
			}



			res.send(meeting_user1);
		});
	}
	else {
		return res.send(500, {error:'No mid or username specified'});
	}

    return next();
});

function getPluginConfig(plugin_name){
	if(config && config.plugins){
		for(var i = 0; i<config.plugins.length; i++){
			if(config.plugins[i].name==plugin_name){
				return config.plugins[i].config;
			}
		}
	}
	return null;
}


function sendMail(sendTo, title, view, attachments){
	console.log('sending mail');
  if(!config.mail || !config.mail.enableMail || config.mail.enableMail === false){
    console.log('There is no configuration for sending mails. The email will not be sent.');
    return;
  }


  fs.readFile(config.mail.htmlFilePath, 'utf8', function (err,template) {
	if (err) {
		return console.log(err);
	}

	var html = mustache.render(template, view);

	var smtpConfig = {
      host: config.mail.host,
      port: config.mail.port,
      secureConnection: false,
      auth: {
          user: config.mail.user,
          pass: config.mail.pass
      },
      tls:{
        ciphers: 'SSLv3'
      }
	};

	var transporter = nodemailer.createTransport(smtpConfig);

	var mailOptions = {
      from: config.mail.address, // sender address
      bcc: sendTo, // list of receivers
      subject: title, // Subject line
      html: html
	};

	if(attachments && attachments.length>0){
		mailOptions.attachments= attachments;
	}

	  // send mail with defined transport object
	transporter.sendMail(mailOptions, function(error, info){
		  if(error){
			  return console.log(error);
		  }
		  console.log('Message sent: ' + info.response);
	});

  });
}

server.post('/image/:mid', function (req, res, next) {
  if(req.params.mid){
    if(req.params.data){
      var bitmap = new Buffer(req.params.data, 'base64');
      var options = { "encoding": "utf-8", "flag": "w+"};
      fs.writeFile(config.imageFolder+"/"+req.params.mid+".jpg", bitmap, options, function(err) {
          if(err) {
             console.log(err);
             res.send(500, {error: 'Image could not be saved.'});
          }
          res.send(req.params.data);
      });
    }else{
      return res.send(500, { error: 'No image' });
    }
  }else{
    return res.send(500, { error: 'No mid' });
  }
  return next();
});
