import db from '../config/db.js'

const database = db

export const getLessees = async (req, res) => {
    try {
        const data = await database.query("SELECT * FROM lessee")
        if (!data) {
            return res.status(404).send({
                success: false,
                message: 'No Record Found'
            })
        }
        res.status(200).send({
            success: true,
            message: "records",
            data: data[0]
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error',
            error
        })
    }
}

export const getLesseeById = async (req, res) => {
    try {
        const lesseeId = req.params.id
        if (!lesseeId) {
            return res.status(404).send({
                success: false,
                message: 'Invalid'
            })
        }
        const data = await database.query('SELECT * FROM lessee WHERE id=?', [lesseeId])
        if (!data) {
            return res.status(404).send({
                success: false,
                message: 'No Records Found'
            })
        }
        res.status(200).send({
            success: true,
            leseeDetails: data[0]
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error',
            error
        })
    }
}