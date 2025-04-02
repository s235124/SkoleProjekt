// eslint-disable-next-line @typescript-eslint/no-require-imports
const mysql = require('mysql2');

const db = mysql.createPool({
    connectionLimit: 10,
    host: '172.23.93.11',
    user: 'v',
    password: 'v',
    database: 'skole' // HAS TO EXIST IN YOUR MYSQL SERVER
});

module.exports = db;