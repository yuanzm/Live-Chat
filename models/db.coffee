config = require '../config'
    
Db = require('mongodb').Db
Connection = require('mongodb').Connection
Server = require('mongodb').Server

module.exports = new Db(config.db, new Server(config.host, Connection.DEFAULT_PORT, {}), {safe: true})


