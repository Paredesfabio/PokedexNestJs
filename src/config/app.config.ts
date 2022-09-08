export const EnvConfiguration = () => ({
    enviroment: process.env.NODE_ENV || 'dev',
    mongodb: process.env.MONGODB,
    port: +process.env.PORT || 3002,
    prefixApi: process.env.PREFIX_API || '',
    defaultLimit: +process.env.DEFAULT_LIMIT || 7,
    defaultOffset: +process.env.DEFAULT_OFFSET || 0,
})