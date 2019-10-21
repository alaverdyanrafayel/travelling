import {
    dbHost,
    dbUsername,
    dbPassword,
    dbDatabase,
    jawsDb
} from '../helpers/config';

let connection = {
    host: dbHost,
    user: dbUsername,
    password: dbPassword,
    database: dbDatabase,
    charset: 'utf8'
};

if (typeof(jawsDb) !== 'undefined' && jawsDb !== '') {
    connection = jawsDb;
}

export default {
    client: 'mysql',
    connection,
    seeds: {
        directory: './src/database/seeders'
    },
    migrations: {
        tableName: 'migrations',
        directory: './src/database/migrations'
    }
};
