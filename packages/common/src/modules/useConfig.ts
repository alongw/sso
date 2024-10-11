import config from './config'
import { Config } from '@nya-account/db'

type SCOPE = keyof (typeof config)['config']['app']

export const useConfig = (scope: SCOPE) => {
    const getConfig = async <
        T extends keyof (typeof config)['config']['app'][typeof scope]
    >(
        config_item: T
    ) => {
        const defaultConfig = config['config']['app'][scope][config_item]

        const [result] = await Config.findOrCreate({
            where: {
                key: `config.app.${scope}.${config_item}`
            },
            defaults: {
                key: `config.app.${scope}.${config_item}`,
                value: JSON.stringify(defaultConfig),
                id: 0
            }
        })

        return JSON.parse(
            result.toJSON().value
        ) as (typeof config)['config']['app'][typeof scope][T]
    }

    return {
        getConfig
    }
}
