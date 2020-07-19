let SqliteDB = require("./Sqlite.js").Sqlite
let fs = require("fs")
let Rsync = require("rsync");
let thisDict = {
}

class ChromeHistory {
    history_db_path = `/Users/neko/Library/Application Support/Google/Chrome/Default/History`;
    db_file = `./History`

    sqlite_sql = {
        init: [
            "PRAGMA foreign_keys = '1';",
            "PRAGMA database_list;",
            "PRAGMA encoding",
        ],
        main_list: "SELECT type,name,tbl_name FROM main.sqlite_master;",
        tables: {
            downloads: {
                counts: `"SELECT COUNT(*) FROM (SELECT "_rowid_",* FROM "main"."downloads" ORDER BY "_rowid_" ASC);"`,
                table: `SELECT "_rowid_",* FROM "main"."downloads" ORDER BY "_rowid_" ASC LIMIT 0, {test};`
            },
            urls: {
                table: `SELECT "_rowid_",* FROM "main"."urls" ORDER BY "last_visit_time" DESC LIMIT {page}, {limit};`,
            }
        },
    }

    watchHistory(file) {
        let rsync = new Rsync()
        rsync.source(file)
            .destination('./History')
            .execute(function (error, code, cmd) {
                console.log('默认加载')
        });
        fs.watch(file, (event, filename) => {
            console.log(`文件发生更新${filename}-${event}`)
            // Build the command
            rsync.source(file)
                .destination('./History')
                .execute(function (error, code, cmd) {
                    // we're done
                    thisDict.chromeHistory.initDB();
                    thisDict.chromeHistory.getHistoryUrls()
                });
        })

    }

    initDB() {
        let that = this;
        return new Promise(function (resolve) {
            if(that.db){
                that.db.close()
            }
            that.db = null;
            that.db = new SqliteDB()
            that.db.connect(that.db_file)
            for (const a of that.sqlite_sql.init) {
                that.db.execute(a)
            }

            resolve()
        })

    }

    /**
     *
     * @param file
     */
    constructor(file) {
        thisDict.chromeHistory = this;
        this.watchHistory(this.history_db_path)

    }

    getHistoryUrls() {
        thisDict.chromeHistory
            .sqlite_sql
            .tables
            .urls
            .table
            .sql_format({page: 0, limit: 1})
            .sql_query(thisDict.chromeHistory.db)
            .then((data) => {
                for (let i = 0; i < data.length; i++) {
                    data[i]['last_visit_time'] = (data[i]['last_visit_time'])
                        .db_time_to_unix()
                        .db_time_format("Y-m-d H:i:s")
                }
                console.debug(data)
            })
    }

}


module.exports = {
    ChromeHistory
};
