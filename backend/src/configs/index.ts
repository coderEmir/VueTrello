import databaseConfig from './database.json'

type Dialect = 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql';

interface MyDataBaseConfig {
    
    username: string,
    password: string,
    database: string,
    host: string,
    dialect: Dialect,
    timezone: string
}
const configs = {
    development: {
        server: {
            host: "localhost",
            port: 8080
        },
        database: databaseConfig.development as MyDataBaseConfig,
        jwt: {
            privateKey: "seeEmil"
        }
    },
    test: {
        server: {
            host: "localhost",
            port: 8080
        },
        database: databaseConfig.development as MyDataBaseConfig,
        jwt: {
            privateKey: "seeEmil"
        }
    },
    production: {
        server: {
            host: "localhost",
            port: 8080
        },
        database: databaseConfig.development as MyDataBaseConfig,
        jwt: {
            privateKey: "seeEmil"
        }
    },
};
// type configKeys = 'development' | 'test' | 'production'
type configKeys = keyof typeof configs

const NODE_ENV = process.env.NODE_ENV as configKeys || 'development'

export default configs[NODE_ENV];