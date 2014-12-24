mongodb = require("mongodb")
poolModule = require('generic-pool')

###
* MongoDB configuration
###
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