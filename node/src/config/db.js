require('dotenv').config();
const { Pool } = require('pg');

const dbConfig = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,                          
  password: process.env.PG_DB_PASSWORD,       
  database: process.env.DB_NAME,                        
  port:  process.env.DB_PORT,                                
  max: process.env.DB_LIMIT,                                  
  idleTimeoutMillis: process.env.IDLETIMEOUTMILLIS,
  ssl: { rejectUnauthorized: false }  
});

dbConfig.on('error', (err) => {
  console.error("❌ Unexpected error on idle client:", err);
});

module.exports = dbConfig;
