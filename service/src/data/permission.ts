export interface Permission {
    pid: number
    permission?: boolean
    [key: string]: Permission | boolean | null | number
}

export const defaultPermissions: Permission = {
    pid: 0,
    admin: {
        pid: 1,
        useradmin: {
            pid: 2,
            permission: true,
            editUserInfo: {
                pid: 3,
                avatar: {
                    pid: 4
                }
            }
        }
    }
}
