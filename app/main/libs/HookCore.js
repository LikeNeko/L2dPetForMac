class HookCore {
    static keys = {
        when_ready:"when_ready"
    };
    static list = {}
    static add(key,callback){
        if (callback&&key){
            this.list[key] = callback;
        }
    }
    static call(key){
        try {
            if (this.list[key]){
                this.list[key]();
            }
        }catch (e) {
            log(e)
        }
    }
}

module.exports = HookCore;