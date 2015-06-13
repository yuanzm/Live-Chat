chatList = {
    who: '1',
    dowhat: 'get_chat_list',
    msg: {
        total_new_msg_count: '3',
        contacts: [
            {
                username: 'cyrilzhao',
                id: "3"
                new_msg_count: 3,
                online: 1,
                className: '',
                avatar: 'http://7sbxao.com1.z0.glb.clouddn.com/login.jpg'
            }
        ]
    }
}

msgs = [
    {'sender': '4', content: "hello"},
    {'sender': '1', content: "hello world"}
]

module.exports =
    chatList: chatList
    msgs: msgs
