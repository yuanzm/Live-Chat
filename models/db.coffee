# config = require '../config'
    
# Db = require('mongodb').Db
# Connection = require('mongodb').Connection
# Server = require('mongodb').Server

# module.exports = new Db(config.db, new Server(config.host, Connection.DEFAULT_PORT, {}), {safe: true})

mongodb = require("mongodb")
poolModule = require('generic-pool')

pool = poolModule.Pool({
    name: 'mongodb'
    create: (callback)->
        mongodb.MongoClient.connect 'mongodb://localhost/Live-Chat', {
            server: {poolSize: 1}
        }, (err, db)->
            callback err, db
    destroy: (db)->
        db.close()
    max: 20
    idleTimeoutMillis: 300000
    log: false
})

module.exports = pool
