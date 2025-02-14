// eslint-disable-next-line @typescript-eslint/no-require-imports
const mysql = require('mysql2');

const db = mysql.createPool({
    connectionLimit: 10,
    host: 'ip_address',
    user: 'your_user',
    password: 'your_password',
    database: 'skole' // HAS TO EXIST IN YOUR MYSQL SERVER
});

module.exports = db;