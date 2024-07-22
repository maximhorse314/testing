const express = require('express')
const cors = require('cors')
// const sqlite3 = require('sqlite3').verbose()
const bodyParser = require('body-parser')
const app = express()
const PORT = 5000

let histories = []

app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
// app.use(express.urlencoded({ extended: true }))

// const db = new sqlite3.Database(':memory:')
app.get('/histories', (req, res) => {
    res.json({
        data: histories
    })

})

app.post('/histories', (req, res) => {
    const { term } = req.body

    histories.push(term)
    res.status(201).json({
        data: term
    })
})

app.delete('/histories', (req, res) => {
    histories = []
    res.json({ message: 'success'})

})

app.listen(PORT, () => {
    
})
