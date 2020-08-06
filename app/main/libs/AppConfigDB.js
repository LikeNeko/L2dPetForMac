const {LowDB} = require('./db/LowDB.js')
class AppConfigDB {
    static keys = {
        model_path:"model.path",
    }
    db = new LowDB(path.res + "db.json")
    get(key,isset = false){
        return this.db.get(key,isset)
    }
}
module.exports = AppConfigDB