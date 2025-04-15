import mysql from 'mysql2/promise'

const mySqlPool = mysql.createPool({
    host: 'localhost',
    user: "root",
    password: 'sqlpass123',
    database: 'testdb',
})

export default mySqlPool