// Import mysql
const mysql = require('mysql2/promise');
require('dotenv').config();

// Create a connection pool
const dbconfig = mysql.createPool(
    {
        host: "127.0.0.1",
        user:"root", //root
        password: '', //password
        database:"remindme", //database
        waitForConnections: true, //wait for connections
        connectionLimit: 10, //max connections
        port: 3306, //port
        queueLimit: 0,//max waiting connections
    }
)

// Export the database
module.exports = dbconfig; 
