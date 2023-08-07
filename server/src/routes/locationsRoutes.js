module.exports = function (server, config, production_mode) {
    
    var locationService = require('../services/locationsService');

    server.get('/api/locations', function (req, res, next) {
        locationService.getAllLocations(config).then(function (locations) {
            if (locations !== null) {
                res.send(locations.sort());
                return next();
            }
            else {
                res.send(404, { error: "No locations found" });
                return next();
            }
        }, function (err) {
            res.send(500, { error: err });
            return next();
        });
    });
}