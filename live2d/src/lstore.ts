
export class LStore {
    /**
     *
     * @param key
     * @param def
     */
    public static get(key:string, def = undefined) {
        if (!window['store']){
            console.error('store未初始化 ')
            return undefined;
        }
        return window['store'].get('live2d.'+key, def)
    }

    public static set(key:string,val){
        if (!window['store']){
            console.error('store未初始化')
            return undefined;
        }
        // iPhoneでのアルファ品質向上のためTypescriptではpremultipliedAlphaを採用
        return window['store'].set('live2d.'+key, val)
    }
}