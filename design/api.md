# Live-Chat API

### Views
- 首页
    - /=>chat.jade
- 用户登录
    - /login => (not login) login.jade => (login) chat.jade
- 用户注册
    - /regist =>(not login) regist.jade => (login) regist.jade

### RESTful JSON APIs(Ajax)
- 发送群聊消息
    - POST /
    - Data: {name,}
    - Response:
        - 200: {result: 'success'}
        - 404: {result: ''}
        - 400: {result: ''}
- 获取用户聊天详情
    - GET /chat/:name/chat-detail
    - Data: {}
    - Response:
        - 200: [{isChating, chatNow}]
- 修改当前聊天对象
    - PUT /chat/String:myName/update-chating-person/String:name
    - Data: {myname, name}
    - Response"
        - 200: {result: 'success'}
        - 400: {result: 'fail', msg: 'myname|name is not correct'}
- 删除聊天列表中的名字
    - DELETE /chat/String:myname/remove-user/String:name
    - Data: {}
    - Response:
        - 200: {result: 'success'}

