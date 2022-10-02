const mariadb = require('mariadb');

const pool = mariadb.createPool({
    // host: process.env.DB_HOST,
    // user: process.env.DB_USER,
    // password: process.env.DB_PASS,
    // database: process.env.DB_NAME,
    host: "localhost",
    user: "root",
    password: "root",
    database: "sample",
    connectionLimit: 5
});

pool.getConnection((err, connection) => {
    if(err){
        console.log(err)
        
        if (err.code === 'PROTOCOL_CONNECTION_LOST'){
            console.error('Database connection is lost');
        }
        if (err.code === 'ER_CON_COUNT_ERROR'){
            console.error('Database has too many connection');
        }
        if (err.code === 'ECONNREFUSED'){
            console.error('Database connection was refused');
        }
    }
    if(connection) connection.release();
    return;
});

module.exports = pool;