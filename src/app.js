
const express = require('express')
require('./db/mongoose')
const userRouter = require('./routes/userrouter')
const taskRouter = require('./routes/taskrouter')

const app = express()

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


module.exports = app