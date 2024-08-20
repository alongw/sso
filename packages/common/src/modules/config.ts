class Config<T> {
    #config: T
    constructor() {
        // 检查是否被 new 调用，不是的话就报错
        if (!(this instanceof Config)) {
            throw new Error('请使用 new 关键字实例化 Config')
        }
    }

    // 设置配置文件
    set(config: T) {
        this.#config = config
    }

    // 获取配置文件
    get<K extends keyof T>(key: K): T[K]
    get(key?: undefined): T
    get<K extends keyof T>(key?: K): T[K] | T {
        if (!key) return this.#config
        if (!this.#config[key]) {
            throw new Error(`配置文件中不存在 ${key.toString()} 字段`)
        }
        return this.#config[key]
    }
}

export default Config
