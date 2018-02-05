module.exports = {
    save: function (mid, data, config, callback) {

        return new Promise(function (resolve, reject) {
            var fs = require('fs');

            var bitmap = new Buffer(data, 'base64');
            var options = { "encoding": "utf-8", "flag": "w+" };
            
            fs.writeFile(config.imageFolder + "/" + mid + ".jpg", bitmap, options, function(error){
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            });
        })
    }
}