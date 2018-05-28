module.exports = function (server, config, production_mode) {
    
    var userService = require('../services/userService');
    var imageService = require('../services/imageService');

    server.get('/user/:username', function (req, res, next) {

        userService.getUserByUsername(req.params.username).then(function (user) {
            if (user !== null) {
                res.send(user);
            }
            else {
                res.send(404, { error: "No user found" });
            }
        }, function (err) {
            return res.send(500, { error: err });
        });

        return next();
    });

    server.post('/user/:username/image', function (req, res, next) {
        if (!req.params.username) {
            return res.send(500, { error: 'No username' });
        }

        if (!req.params.data) {
            return res.send(500, { error: 'No image' });
        }

        if (req.params.username !== req.user.uid) {
            return res.send(500, { error: 'Not allowed' });
        }

        imageService.save(req.params.username, req.params.data, config.userImageFolder).then(function () {
            res.send(req.params.data);
        }).catch(function (err) {
            console.log(err);
            res.send(500, { error: 'Image could not be saved.' });
        });

        return next();
    });

    server.put('/user/:username/settings', function (req, res, next) {
        if (!req.params.username) {
            return res.send(500, { error: 'No username' });
        }

        if (req.params.username !== req.user.uid) {
            return res.send(500, { error: 'Not allowed' });
        }

        userService.saveSettings(req.user.uid, req.params).then(function (user) {
            res.send(user);
        }, function (err) {
            console.log(err);
            res.send(500, { error: 'Settings could not be saved.' });
        });
    });

    server.put('/user/:username/additional_info', function (req, res, next) {
        if (!req.params.username) {
            return res.send(500, { error: 'No username' });
        }

        if (req.params.username !== req.user.uid) {
            return res.send(500, { error: 'Not allowed' });
        }

        userService.saveAdditionalInfo(req.user.uid, req.params).then(function (user) {
            res.send(user);
        }, function (err) {
            console.log(err);
            res.send(500, { error: 'Info could not be saved.' });
        });
    });

    server.del('/user/:username/image', function (req, res, next) {
        if (!req.params.username) {
            return res.send(500, { error: 'No username' });
        }

        if (req.params.username !== req.user.uid) {
            return res.send(500, { error: 'Not allowed' });
        }

        imageService.delete(req.params.username, config.userImageFolder).then(function () {
            res.send(true);
        }).catch(function (err) {
            console.log(err);
            res.send(500, { error: 'Image could not be deleted.' });
        });

        return next();
    });
}