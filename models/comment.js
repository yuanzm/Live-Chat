var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;
var ObjectId  = Schema.ObjectId;
var BaseModel = require("./base_model");

var CommentSchema = new Schema({
    content: {type: String},
    topic_id: {type: ObjectId},
    author_id: {type: ObjectId},
    comment_id: {type: ObjectId},
    create_at: {type: Date, default: Date.now},
    update_at: {type: Date, default: Date.now},
    deleted: {type: Boolean, default: false}
});

CommentSchema.plugin(BaseModel);
CommentSchema.index({topic_id: 1});
CommentSchema.index({author_id: 1, create_at: -1});

mongoose.model("Comment", CommentSchema);
