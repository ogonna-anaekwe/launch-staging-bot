var express = require('express')
const app = express()
const { version }= require('../package.json')
var libraryInformation = require('../src/controllers/getLibraryInformation')
require('dotenv').config()

app.get('/version', (req, res) => {
  res.json({ version })
})

app.get('/staging', async (req, res) => {
    libraryInformation()
    res.status(200).json({"update": "pinged staging environment"})
})

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
  console.log(`listening on port ${process.env.PORT}`)
  console.log('Press Ctrl+C to quit.')
})