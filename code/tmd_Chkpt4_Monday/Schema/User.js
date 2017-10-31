var mongoose = require('mongoose');
console.log("Loading Users...");
// like schema
var userSchema = new mongoose.Schema({
    name: {type: String, lowercase: false, trim: true },
    zapros: [{type: String, lowercase:true }],
    chat_id:{type: Number, unique:true},
    lb:{type:[]},
    taken:{type: []}

    //нужно делать splice для thing

});
console.log("Users loaded.");
module.exports = mongoose.model('Users', userSchema);
