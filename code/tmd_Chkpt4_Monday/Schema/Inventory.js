var mongoose = require('mongoose');
console.log("Loading Inventory...");
// like schema
var inventorySchema = new mongoose.Schema({
    name: {type: String , lowercase: true},
   	code: {type: Number, lowercase:true, unique:true},
    img: {type: String},
    open:{type: Boolean},
    amount:{type:Number},
    kanc:{type: Boolean} //every tovar may be konc or not konc
    //нужно делать splice для users


});
console.log("Inventory loaded.");
module.exports = mongoose.model('Inventories', inventorySchema);
