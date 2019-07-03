const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')

const mongoUrl = 'mongodb+srv://gps2601:test123@fieldnote-3fejg.mongodb.net/blog?retryWrites=true&w=majority'

mongoose.connect(mongoUrl, {useNewUrlParser: true})
app.use(cors())
app.use(bodyParser.json())
app.use("/", blogsRouter)

module.exports = app