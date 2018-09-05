module.exports = {
	diff: function(oldJSON, newJSON) {
        var moment = require('moment');
        var result = {};

        const keys = Object.keys(oldJSON);

        keys.forEach(key => {
            if(oldJSON[key] instanceof Date ){//property is a date
                const oDate = moment(oldJSON[key]);
                const mDate =moment(newJSON[key]);
                if(oDate.diff(mDate) !== 0){
                    result[key] = [oldJSON[key], newJSON[key]];
                }
            }
            else{
                if(oldJSON[key] !== newJSON[key]){
                    result[key] = [oldJSON[key], newJSON[key]];
                }
            }
        });

        return result;
    }
};