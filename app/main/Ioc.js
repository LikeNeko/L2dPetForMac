class Ioc {
    constructor() {
        this.container = new Map()
        this.fakes = new Map()
    }
    // 直接绑定一个回调或者一个值
    bind(key, callback) {
        this.container.set(key, { callback:callback, single: false })
    }
    // 绑定一个单例
    singleton(key, callback) {
        console.log({ callback:callback, single: true })
        this.container.set(key, { callback:callback, single: true })
    }
    fake(key, callback) {
        this.fakes.set(key, { callback:callback, single: false })
    }
    restore(key) {
        this.fakes.delete(key)
    }

    findInContainer(key) {
        if (this.fakes.has(key)) {
            return this.fakes.get(key)
        }
        return this.container.get(key)
    }
    use(key) {
        const item = this.findInContainer(key)
        if (!item) {
            throw new Error('error')
        }
        if (item.single && !item.instance) {
            item.instance = item.callback()
        }

        return item.single ? item.instance : item.callback()
    }
}
module.exports = {
    Ioc
}