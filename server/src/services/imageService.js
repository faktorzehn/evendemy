module.exports = {
    save: function (name, data, folder, callback) {

        return new Promise(function (resolve, reject) {
            var fs = require('fs');

            let bitmap = data.split(';base64,').pop();
            var options = { "encoding": "base64", "flag": "w+" };
            
            fs.writeFile(folder + "/" + name + ".jpg", bitmap, options, function(error){
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            });
        })
    },

    delete: function (name, folder, callback) {

        return new Promise(function (resolve, reject) {
            var fs = require('fs');
            
            fs.unlink(folder + "/" + name + ".jpg", function(error){
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            });
        })
    },

    exists: function (name, folder) {
        var fs = require('fs');

        try {
            if (fs.existsSync(path)) {
              return true;
            }
        } catch(err) {
            return false;
        }
    }
}