var restify = require('restify');
var mongoose = require('mongoose');
var fs = require('fs');
var config = require('./config');
var auth = require('./plugins/auth.js');

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

var mailConfig = require('./assets/mail.json');
config.mail.config = mailConfig;

//init mongo db
mongoose.connect(config.db.url);

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

server.pre((req, res, next) => {

  res.header('Access-Control-Allow-Origin', req.header('origin'));
  res.header('Access-Control-Allow-Headers', req.header('Access-Control-Request-Headers'));
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");

  if(req.method === 'OPTIONS')
      return res.send(204);

  next();

});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser({ "mapFiles": true }));
server.use(restify.plugins.authorizationParser());
server.use(auth(config));

server.listen(40274, function () {
	console.log('Server started @ 40274');
	require('./routes')(server, config, production_mode);
});