var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var BaseModel = require("./base_model");


var UserSchema = new Schema({
    loginname: {type: String},
    password: {type: String},
    email: {type: String},
    
    avatar: {type: String, default: ''},
    location: {type: String, default: ''},
    signature: {type: String, default: ''},
    male: {type: String, default: ''},
    wechat: {type: String, default: ''},
    qq: {type: String, default: ''},
	name: {type: String, default: ''},

    online: {type: Boolean, default: false},
    score: {type: Number, default: 0},
    topic_count: {type: Number, default: 0},
    comment_count: {type: Number,default: 0},
    follwer_count: {type: Number, default: 0},
    follwing_count: {type: Number, default: 0},
    collect_topic_count: {type: Number, default: 0},
    be_collect_topic_count: {type: Number, default: 0},
    create_at: {type: Date, default: Date.now},
    update_at: {type: Date, default: Date.now},
    is_admin: {type: Boolean, default: false}
});

UserSchema.plugin(BaseModel);

UserSchema.virtual('isAdvanced').get(function () {
  // 积分高于 700 则认为是高级用户
  return this.score > 700 || this.is_star;
});

UserSchema.index({loginname: 1}, {unique: true});
UserSchema.index({email: 1}, {unique: true});
UserSchema.index({score: -1});

mongoose.model('User', UserSchema);
