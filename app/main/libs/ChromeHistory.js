let SqliteDB = require("./Sqlite.js").Sqlite
let fs = require("fs")
let Rsync = require("rsync");
let os = require("os")

class ChromeHistory {
    history_db_path = `/Library/Application Support/Google/Chrome/Default/History`;
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
                table: `SELECT "_rowid_",* FROM "main"."downloads" ORDER BY "_rowid_" DESC LIMIT {page}, {limit};`
            },
            urls: {
                table: `SELECT "_rowid_",* FROM "main"."urls" ORDER BY "last_visit_time" DESC LIMIT {page}, {limit};`,
            }
        },
    }

    constructor() {

    }
    begin(){
        this.watchHistory(os.homedir() + this.history_db_path )
    }
    /**
     * 监听文件实时变化
     * @param file
     */
    watchHistory(file) {
        let rsync = new Rsync()
        rsync.source(file)
            .destination('./History')
            .execute(function (error, code, cmd) {
                log('load History success',cmd,code)
        }.bind(this));

        fs.watch(file, function(event, filename)  {
            console.log(`文件发生更新${filename}-${event}`)
            // Build the command
            rsync.source(file)
                .destination('./History')
                .execute(function (error, code, cmd) {
                    // we're done
                    // 初始化 去同步一下
                    this.initDB();
                    this.getHistoryUrls()
                }.bind(this));
        }.bind(this))

    }

    initDB() {
        return new Promise(function (resolve) {
            if(this.db){
                this.db.close()
            }
            this.db = null;
            this.db = new SqliteDB()
            this.db.connect(this.db_file)
            for (const a of this.sqlite_sql.init) {
                this.db.execute(a)
            }

            resolve()
        }.bind(this))

    }


    getHistoryUrls() {
        this.sqlite_sql
            .tables
            .urls
            .table
            .sql_format({page: 0, limit: 1})
            .sql_query(this.db)
            .then(function(data) {
                for (let i = 0; i < data.length; i++) {
                    data[i]['last_visit_time'] = (data[i]['last_visit_time'])
                        .db_time_to_unix()
                        .db_time_format("Y-m-d H:i:s")
                }
                // console.debug(data)
                main.webContents.send(RPC.chrome_history,data[0])
            }.bind(this))
    }

}


module.exports = {
    ChromeHistory
};
