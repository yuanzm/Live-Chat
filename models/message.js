var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;
var ObjectId  = Schema.ObjectId;
var BaseModel = require("./base_model");

var MessageSchema = new Schema({
   	content: {type: String},
    sender_id: {type: String},	// 发送者的id
    sender_name: {type: String},
    sender_avatar: {type: String},
    receiver_id: {type: String},	// 接受者的id
    has_read: {type: Boolean, default: false},	// 消息是否已读
    create_at: {type: Date, default: Date.now}	// 创建时间
});

MessageSchema.plugin(BaseModel);
mongoose.model('Message', MessageSchema);
