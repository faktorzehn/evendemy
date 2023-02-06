module.exports = function (server, config, production_mode) {
    
    var userService = require('../services/userService');
    var imageService = require('../services/imageService');
    var userModel = require('../models/user');

    server.get('/user/:username', function (req, res, next) {

        userService.getUserByUsername(req.params.username).then(function (user) {
            if (!user) {
                res.send(404, { error: "No user found" });
                return next();
            }

            if (req.params.username !== req.user.uid) {
                if(user.options && !user.options.additional_info_visible){
                    user.additional_info = null;
                }
            }

            res.send(user);
            return next();
        }, function (err) {
            res.send(500, { error: err });
            return next();
        });
    });

    server.post('/user/:username/image', function (req, res, next) {
        if (!req.params.username) {
            res.send(500, { error: 'No username' });
            return next();
        }

        if (!req.body.data) {
            res.send(500, { error: 'No image' });
            return next();
        }

        if (req.params.username !== req.user.uid) {
            res.send(500, { error: 'Not allowed' });
            return next();
        }

        imageService.save(req.params.username, req.body.data, config.userImageFolder)
            .then(data => {
                var user = { avatar: true };
                return userModel.findOneAndUpdate({ username: req.params.username }, { $set: user }, { upsert: true, new: true });
            })
            .then( user => {
                res.send(req.params.data);
                return next();
            })
            .catch(function (err) {
                console.log(err);
                res.send(500, { error: 'Image could not be saved.' });
                return next();
            });
    });

    server.put('/user/:username/settings', function (req, res, next) {
        if (!req.params.username) {
            res.send(500, { error: 'No username' });
            return next();
        }

        if (req.params.username !== req.user.uid) {
            res.send(500, { error: 'Not allowed' });
            return next();
        }

        userService.saveSettings(req.user.uid, req.body).then(function (user) {
            res.send(user);
            return next();
        }, function (err) {
            console.log(err);
            res.send(500, { error: 'Settings could not be saved.' });
            return next();
        });
    });

    server.put('/user/:username/additional_info', function (req, res, next) {
        if (!req.params.username) {
            res.send(500, { error: 'No username' });
            return next();
        }

        if (req.params.username !== req.user.uid) {
            res.send(500, { error: 'Not allowed' });
            return next();
        }

        userService.saveAdditionalInfo(req.user.uid, req.body).then(function (user) {
            res.send(user);
            return next();
        }, function (err) {
            console.log(err);
            res.send(500, { error: 'Info could not be saved.' });
            return next();
        });
    });

    server.del('/user/:username/image', function (req, res, next) {
        if (!req.params.username) {
            res.send(500, { error: 'No username' });
            return next();
        }

        if (req.params.username !== req.user.uid) {
            res.send(500, { error: 'Not allowed' });
            return next();
        }

        imageService.delete(req.params.username, config.userImageFolder)
            .then(data => {
                var user = { avatar: false };
                return userModel.findOneAndUpdate({ username: req.params.username }, { $set: user }, { upsert: true, new: true });
            })
            .then( user => {
                res.send(true);
                return next();
            })
            .catch(function (err) {
                console.log(err);
                res.send(500, { error: 'Image could not be deleted.' });
                return next();
            });
    });
}