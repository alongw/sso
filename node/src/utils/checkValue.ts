const checkValue = (...value: unknown[]): boolean => {
    for (const e of value) {
        if (e === undefined || e === null || e === '') return false

        if (e instanceof Array && !checkValue(...e)) return false

        if (typeof e === 'object' && !checkValue(...Object.values(e))) return false
    }

    return true
}

export const checkGetTokenValue = (
    grant_type: string,
    code: string,
    redirect_uri: string,
    client_id: string,
    client_secret: string
): boolean | string => {
    if (!checkValue(grant_type)) {
        return 'grant_type is required'
    }
    if (!checkValue(code)) {
        return 'code is required'
    }
    if (!checkValue(redirect_uri)) {
        return 'redirect_uri is required'
    }
    if (!checkValue(client_id)) {
        return 'client_id is required'
    }
    if (!checkValue(client_secret)) {
        return 'client_secret is required'
    }
    return true
}

export default checkValue
