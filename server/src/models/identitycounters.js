const mongoose = require('mongoose');

const IdentityCountersSchema = mongoose.Schema({
    model: {type: String, default: ''},
    field: {type: String, default: ''},
    count: {type: Number, default: 1},
    __v: {type: Number, default: 0}
});

const IdentityCounters = mongoose.model('identitycounters', IdentityCountersSchema);

IdentityCounters.createIndex = (model, name, field) => {
    model.pre('validate', function() {
        var doc = this;
        return new Promise((resolve, reject)=>{
            IdentityCounters.findOneAndUpdate({model: name}, {$inc: { count: 1} }, {upsert: true},  function(error, identityCounter) {
                if(error) {
                    return reject(error);
                }
                if(!doc[field]){
                    doc[field] = identityCounter ? identityCounter.count : 0;
                }
                resolve(doc);
            });
        });
    });
}

module.exports = IdentityCounters; 