var restify = require('restify');
var mongoose = require('mongoose');
var fs = require('fs');
var corsMiddleware = require('restify-cors-middleware');
var autoIncrement = require('mongoose-auto-increment');
var config = require('./config');
var auth = require('./auth.js');

var production_mode = true;

//load config for production mode or development and log it
try {
	var developer_config = require('./developer-config');
	if (developer_config) {
		console.warn('ATTENTION: You are using the developer - not production mode.');
		console.warn('If you dont want developer mode: Please delete developer-config.json and restart this server.');
		config = developer_config;
		production_mode = false;
	}
} catch (e) {
	console.warn('No developer config found. Production mode!');
}

//set cors
var cors = corsMiddleware({
	allowHeaders: ['Authorization']
});

var databaseUrl = process.env.EVENDEMY_DATABASE_URL;

if(!databaseUrl) {
	console.error("ERROR: DatabaseUrl undefined");
	process.exit(155);
}

//init mongo db
var db = mongoose.connect(databaseUrl);
autoIncrement.initialize(db);

//config for restify server
var serverconfig = config.serverconfig;
var serverObj = {};
if (serverconfig.name) {
	serverObj['name'] = serverconfig.name;
}
if (serverconfig.certificatePath) {
	serverObj['certificate'] = fs.readFileSync(serverconfig.certificatePath);
}
if (serverconfig.keyPath) {
	serverObj['key'] = fs.readFileSync(serverconfig.keyPath);
}
var server = restify.createServer(serverObj);

server.pre(cors.preflight);
server.use(cors.actual);
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser({ "mapFiles": true }));
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
	require('./routes')(server, config, production_mode);
});