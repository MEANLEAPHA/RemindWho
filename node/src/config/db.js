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
const { Pool } = require('pg');   // <-- import Pool properly

const dbConfig = new Pool({
  host: "aws-1-ap-southeast-1.pooler.supabase.com",
  user: "postgres.vdfsdzsyouzthauqukau",                          
  password: process.env.PG_DB_PASSWORD,       
  database: "postgres",                        
  port:  6543,                                
  max: 15,                                  
  idleTimeoutMillis: 60000,
  ssl: { rejectUnauthorized: false }  
});

dbConfig.on('error', (err) => {
  console.error("❌ Unexpected error on idle client:", err);
});

console.log("✅ Postgres Pool initialized");

module.exports = dbConfig;
