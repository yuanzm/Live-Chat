var tools = require("../common/tools");

// 给所有的Schema实例构建自己的实例方法
module.exports = function(schema) {
    schema.methods.create_at_ago = function() {
        return tools.formatDate(this.creat_at, true);
    };

    schema.methods.update_at_ago = function() {
        return tools.formatDate(this.creat_at, true);
    }
}
