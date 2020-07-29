const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

class LowDB {

    db =null;

    constructor(db_file) {
        // Set some defaults
        const adapter = new FileSync(db_file)
        this.db = low(adapter)
    }

    demo(){
        db.defaults({posts: [], user: {}})
            .write()
        // Add a post
        db.get('posts')
            .push({id: 1, title: 'lowdb is awesome'})
            .write()

        // Set a user using Lodash shorthand syntax
        db.set('user.name', 'typicode')
            .write()
    }

    insert() {


    }

    /**
     * 获取一个key，
     * @param key
     * @param is_set true 则 生成默认null
     * @returns {*}
     */
    get(key,is_set=false){
        if (is_set){
            this.db.set(key).write()
            return this.db.get(key).value()
        }
        return this.db.get(key).value()
    }
}


module.exports = {
    LowDB
}