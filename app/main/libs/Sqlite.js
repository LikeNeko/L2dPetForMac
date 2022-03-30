let sqlite = require('sqlite3').verbose();
let sqlite3 = require('sqlite3');

// async created () {
//     const db = Sqlite.getInstance()
//     await db.connect('./database/tabletSign.db')
//     await db.run('CREATE TABLE IF NOT EXISTS test(a int, b char)')
//     await db.run(`INSERT INTO test VALUES(10, 'abcd')`)
//     const response = await db.all('SELECT * FROM test')
//     db.close()
// }

class Sqlite {
    db
    exist
    static instance;

    constructor() {
    }

    // 连接数据库
    connect(path) {
        return new Promise((resolve, reject) => {
            this.db = new sqlite.Database(path,sqlite3.OPEN_READONLY, (err) => {
                this.db.configure("busyTimeout", 3000);
                if (err === null) {
                    resolve(err)
                } else {
                    reject(err)
                }
            })
        })
    }

    // 运行sql
    run(sql, params) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, (err) => {
                if (err === null) {
                    resolve(err)
                } else {
                    reject(err)
                }
            })
        })
    }

    // 运行多条sql
    exec(sql) {
        return new Promise((resolve, reject) => {
            this.db.exec(sql, (err) => {
                if (err === null) {
                    resolve(err)
                } else {
                    reject(err)
                }
            })
        })
    }

    // 查询一条数据
    get(sql, params) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    }

    // 查询所有数据
    all(sql, params) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    }


    create(sql) {
        let that = this;
        that.db.serialize(function () {
            that.db.run(sql, function (err) {
                if (null != err) {
                    console.log(err);
                    return 0;
                }
            });
        });
    };

    /// tilesData format; [[level, column, row, content], [level, column, row, content]]
    insertAll(sql, objects) {
        let that = this
        this.db.serialize(function () {
            let stmt = that.db.prepare(sql);
            for (let i = 0; i < objects.length; ++i) {
                stmt.run(objects[i]);
            }

            stmt.finalize();
        });
    };

    call_query(sql, callback) {
        let that = this;
        this.db.all(sql, function (err, rows) {
            if (null != err) {
                console.log(err);
                return;
            }
            if (that.debug) {
                console.log(sql)
            }
            /// deal query data.
            if (callback) {
                callback(rows);
            }
        });
    };
    query(sql) {
        return new Promise((resolve, reject) => {
            try {
                return this.call_query(sql, (data) => {
                    resolve(data)
                })
            } catch (e) {
                reject(e)
            }
        })
    }

    execute(sql) {
        let that = this;
        return new Promise(function (resolve, reject) {
            that.db.run(sql, function (err) {
                if (null != err) {
                    console.log(err);
                    reject();
                }
                if (that.debug) {
                    console.log(sql)
                    resolve()
                }
            });
        })

    };

    // 关闭数据库
    close() {
        this.db.close()
    }

    // 单例
    static getInstance() {
        if (this.instance){
            return this.instance;
        }else{
            let ins= new Sqlite();
            this.instance = ins;
            return ins;
        }
    }
}


Promise.prototype.done = function(data){
    if (typeof data == 'function'){
        data();
    }
}
String.prototype.sql_query = function (db) {
    return new Promise((resolve, reject) => {
        try {
            db.call_query(this.trim(), (data) => {
                resolve(data)
            })
        } catch (e) {
            reject(e)
        }
    })
}
String.prototype.sql_format = function () {
    let formatted = this;
    for (let prop in arguments[0]) {
        let regexp = new RegExp('\\{' + prop + '\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[0][prop]);
    }
    return formatted;
};
Number.prototype.db_time_to_unix = function () {
    return (this / 1000000 - 11644473600)
}
Number.prototype.db_time_format = function (formats) {
    // formats格式包括
    // 1. Y-m-d
    // 2. Y-m-d H:i:s
    // 3. Y年m月d日
    // 4. Y年m月d日 H时i分
    formats = formats || 'Y-m-d';
    let timestamp = this * 1000

    let zero = function (value) {
        if (value < 10) {
            return '0' + value;
        }
        return value;
    };
    let myDate = timestamp ? new Date(timestamp) : new Date();

    let year = myDate.getFullYear();
    let month = zero(myDate.getMonth() + 1);
    let day = zero(myDate.getDate());

    let hour = zero(myDate.getHours());
    let minite = zero(myDate.getMinutes());
    let second = zero(myDate.getSeconds());

    return formats.replace(/Y|m|d|H|i|s/ig, function (matches) {
        return ({
            Y: year,
            m: month,
            d: day,
            H: hour,
            i: minite,
            s: second
        })[matches];
    });
};


// export SqliteDB.
module.exports = {
    Sqlite
}