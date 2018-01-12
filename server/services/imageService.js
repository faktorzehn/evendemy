module.exports = {
    save: function (mid, data, config, callback) {
        var fs = require('fs');

        var bitmap = new Buffer(data, 'base64');
        var options = { "encoding": "utf-8", "flag": "w+" };
        console.log('Try to write to: ' + config.imageFolder);
        fs.writeFile(config.imageFolder + "/" + mid + ".jpg", bitmap, options, callback);
    }
}