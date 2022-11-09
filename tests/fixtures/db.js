const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/models/usermodel')
const Task = require('../../src/models/taskmodel')

const useroneId = new mongoose.Types.ObjectId()

const userOne = {
    _id: useroneId,
    name: 'johnny quest',
    email: 'bippitboppityboop@mccool.com',
    password: 'Hug3mS0hard!',
    tokens: [{
        token: jwt.sign({ _id: useroneId }, process.env.JWT_SECTRET)
    }]
}

const userTwoId = new mongoose.Types.ObjectId()

const userTwo = {
    _id: userTwoId,
    name: 'chachi mccool',
    email: 'bladiddiyblah@mccool.com',
    password: 'Hug3mS0hard!',
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECTRET)
    }]
}


const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'First Task',
    completed: false,
    owner: userOne._id
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Second Task',
    completed: true,
    owner: userOne._id
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Third Task',
    completed: true,
    owner: userTwo._id
}

const setupDatabase = async () => {
    await User.deleteMany()
    await Task.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}


module.exports = {
    userOne,
    useroneId,
    userTwo,
    userTwoId,
    taskOne,
    setupDatabase
}