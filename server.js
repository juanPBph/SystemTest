import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv'
import mySqlPool from './config/db.js'
import lesseeRoute from './routes/lesseeRoutes.js'
const app = express();
dotenv.config()

app.use(express.json())
app.use('/api/lessee', lesseeRoute)
app.get('/test', (req, res) => {
    res.status(200).send("<h1>SERVER RUNNING </h1>")
})

const PORT = process.env.PORT

mySqlPool.query('SELECT 1').then(() => {

    console.log('MYSQL DB CONNECTED')
    app.listen(PORT, () => {
        console.log(`Run server on port ${PORT}`)
    })
})
    .catch((error) => {
        console.log(error)
    })

