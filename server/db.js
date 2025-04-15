// eslint-disable-next-line @typescript-eslint/no-require-imports
const mysql = require('mysql2');

const db = mysql.createPool({
    connectionLimit: 10,
    host: '172.20.9.67',
    user: 'v',
    password: 'v',
    database: 'skole', // HAS TO EXIST IN YOUR MYSQL SERVER
    timezone: 'Z'
});

module.exports = db;