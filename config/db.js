import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
dotenv.config()
const mySqlPool = mysql.createPool({
    host: 'localhost',
    user: "root",
    password: process.env.DBPASS,
    database: 'testdb',
})

export default mySqlPool