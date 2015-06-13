var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;
var ObjectId  = Schema.ObjectId;
var BaseModel = require("./base_model");

var GropuSchema = new Schema({
    name: {type: String},
    create_at: {type: Date, default: Date.now},
    user_count: {type: Number}
});

GropuSchema.plugin(BaseModel);
mongoose.model('Group', GropuSchema);
