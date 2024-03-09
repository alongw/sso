export const checkValue = (...value: unknown[]): boolean => {
    for (const e of value) {
        if (e === undefined || e === null || e === '') return false

        if (e instanceof Array && !checkValue(...e)) return false

        if (typeof e === 'object' && !checkValue(...Object.values(e))) return false
    }

    return true
}
