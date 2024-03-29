// base64 转 Uint8Array
export const base64ToUint8Array = (base64: string) => {
    const binary_string = atob(base64)
    const len = binary_string.length
    const bytes = new Uint8Array(len)
    for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i)
    }
    return bytes
}

// Uint8Array 转 base64
export const uint8ArrayToBase64 = (u8: Uint8Array) => {
    let binary = ''
    const bytes = [].slice.call(new Uint8Array(u8))
    bytes.forEach((e: number) => (binary += String.fromCharCode(e)))
    return btoa(binary)
}
