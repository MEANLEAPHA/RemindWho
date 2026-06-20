// // Import mysql
// const e = require('express');
// const mysql = require('mysql2/promise');
// require('dotenv').config();

// // Create a connection pool
// const dbconfig = mysql.createPool(
//     {
//         host: "srv1656.hstgr.io", //localhost
//         user:"u859618886_remindmeAdmin", //root
//         password: 'Remindme$$333company', //password
//         database:"u859618886_remindmeDB", //database
//         waitForConnections: true, //wait for connections
//         connectionLimit: 10, //max connections
//         port: 3306, //port
//         queueLimit: 0,//max waiting connections
//     }
// )

// // Export the database
// module.exports = dbconfig; 


require('dotenv').config();
const pg = require('pg');

const dbConfig = new Pool({
  host: "db.vfdsdzsyouzthauqukau.supabase.co", // from Supabase dashboard
  user: "postgres",                           // default user
  password: process.env.PG_DB_PASSWORD,          // from Supabase dashboard
  database: "postgres",                       // default database
  port: 5432,                                 // Postgres default
  max: 15,                                    // your choice
  idleTimeoutMillis: 60000,  
});

module.exports = dbConfig;