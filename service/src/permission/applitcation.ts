interface ApplicationPermission {
    // 唯一标识符
    apppid: number
    // 名称
    name: string
    // 描述（xxx 将能够 description）
    description: string
    // 使用此权限的要求等级
    typeRequire: number
    // 是否默认选中
    defaultCheck: boolean
    // 是否锁定
    lock: boolean
    // 优先级
    priority: number
}

export const defaultAppPermission: ApplicationPermission[] = [
    {
        apppid: 1,
        name: '读取您的基础信息',
        description: '读取您的昵称和头像',
        typeRequire: 0,
        defaultCheck: true,
        lock: true,
        priority: 100
    },
    {
        apppid: 2,
        name: '读取您的邮箱地址',
        description: '读取您的电子邮箱地址',
        typeRequire: 0,
        defaultCheck: true,
        lock: false,
        priority: 90
    }
    // {
    //     apppid: 3,
    //     name: '读取您的实名信息',
    //     description: '读取您的实名信息',
    //     typeRequire: 0,
    //     defaultCheck: true,
    //     lock: false,
    //     priority: 20
    // }
]
