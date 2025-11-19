// Import mysql
const e = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();

// Create a connection pool
const dbconfig = mysql.createPool(
    {
        host: "srv1656.hstgr.io", //localhost
        user:"u859618886_remindmeAdmin", //root
        password: 'Remindme$$333company', //password
        database:"u859618886_remindmeDB", //database
        waitForConnections: true, //wait for connections
        connectionLimit: 10, //max connections
        port: 3306, //port
        queueLimit: 0,//max waiting connections
    }
)

// Export the database
module.exports = dbconfig; 
