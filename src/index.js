const app = require('./app')
const port = process.env.PORT


app.listen(port, () => {
    console.log('server is rollin on prt:' + port)
})



// const multer = require('multer')
// const upload = multer({
//     dest: 'images'
// })

// //upload.single('uploadimg'),


// app.post('/upload', upload.single('uploadimg'), (req, res) => {
//     res.send('bladdididy blah')
// }, (error, req, res, next) => {
//     res.status(406).send({ error: error.message })
// })



// app.use((req, res, next) => {
//     if (req.method === 'GET') {
//         res.send('GET request are disabled')
//     } else {
//         next()
//     }
// })

// app.use((req, res, next) => {
//     res.status(503).send({ status: 503, message: 'Site is currently under Maintenance' })
// })








jwt = require('jsonwebtoken')

const myFunction = async () => {

    const token = jwt.sign({ _id: 'abc123' }, 'thisismyseriesofcharacters', { expiresIn: '1 days' })
    console.log(token)

    const verify = jwt.verify(token, 'thisismyseriesofcharacters')

    console.log(verify)
}

myFunction()


const pet = {
    name: 'dobbie',
    age: 5
}

pet.toJSON = function () {
    // console.log(this)
    delete this.name
    return this
}

console.log(JSON.stringify(pet))


// const Task = require('./models/taskmodel')
// const User = require('./models/usermodel')

// const main = async () => {
//     // const task = await Task.findById('6361fcf2ad6f70ea75f84a9b')
//     // await task.populate('owner')
//     // console.log(task.owner)

//     const user = await User.findById('6361fbdc651524134d54c085')
//     await user.populate('tasks')
//     console.log(user.tasks)

// }

// main()

