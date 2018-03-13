module.exports = {
    save: function (mid, data, config, callback) {

        return new Promise(function (resolve, reject) {
            var fs = require('fs');

            let bitmap = data.split(';base64,').pop();
            var options = { "encoding": "base64", "flag": "w+" };
            
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