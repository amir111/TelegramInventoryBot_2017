var mongoose = require('mongoose');

// like schema
var thingSchema = new mongoose.Schema({
    code: {type: Number , unique: true},
    amount:[{type: Number, unique:false, lowercase:true }],
    users: []
    //нужно делать splice для users


});
module.exports = mongoose.model('Things', thingSchema);
