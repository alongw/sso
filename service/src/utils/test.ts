const key = [
    {
        value: 'key1value',
        desc: 'key1-desc'
    },
    {
        value: 'key2value',
        desc: 'key2-desc'
    },
    {
        value: 'key3value',
        desc: 'key3-desc'
    }
] as const

type Value = (typeof key)[number]['value']

export const fn = (value: Value) => {}
