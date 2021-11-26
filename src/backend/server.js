const express = require('express')
const app = express()
require('dotenv').config()
const path = require('path')
const mongoose = require("mongoose")

const Purrer = require(path.join(__dirname, '../backend/dbmodels/Purrer.js'))

mongoose.connect(process.env.DBURL, {useNewUrlParser: true, useUnifiedTopology: true})

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, '/views'))

app.use(express.static(path.join(__dirname, '../../dist')))

app.get('/', (req, res) => {
  res.status(200).render('index')
})

app.get('/purrerData', (req, res) => {
  Purrer.findOne((error, result) => {
    if(error) {
      console.log(error)
    } else {
      res.status(200).json(result)
    }
  })
})

app.listen(process.env.PORT, console.log('Server Up'))