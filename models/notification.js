// 引入所需模块
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var BaseModel = require("./base_model");

var NotificationSchema = new Schema({
    type: {type: String},			// 消息的类型
    sender_id: {type: ObjectId},	// 发送者的id
    receiver_id: {type: ObjectId},	// 接受者的id
    topic_id: {type: ObjectId},		//	与消息有关的话题
    comment_id: {type: ObjectId},	// 与消息有关的评论
    has_read: {type: Boolean, default: false},	// 消息是否已读
    create_at: {type: Date, default: Date.now}	// 创建时间
});

NotificationSchema.plugin(BaseModel);
NotificationSchema.index({has_read: -1, create_at: -1});

mongoose.model('Notification', NotificationSchema);
