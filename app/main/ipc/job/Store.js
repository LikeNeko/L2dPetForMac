class Store{
    static name = 'store';

    static get(event, arg){
        event.returnValue = global.store.get(arg.key,arg.defalut);
    }
    static set(event, arg){
        global.store.set(arg.key,arg.value)
        event.returnValue = arg.value;
    }
}
module.exports = {
    Store
}