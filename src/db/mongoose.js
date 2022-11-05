const mongoose = require('mongoose')
// const NewTask = require('./models/taskmodel')
// const NewUser = require('./models/usermodel')


//mongoose.connect('mongodb://localhost:27017/users')
mongoose.connect(process.env.MONGODB_URL)

// const Cat = mongoose.model('Cat', {
//     name: String,
//     age: Number
// });





//const kitty = new Cat({ name: 'kovu', age: 7 });

// const newTask = new NewTask({
//     description: 'i am required yo',
//     note: 'you love her'
// })


// const newUser = new NewUser({
//     name: 'chachi',
//     age: 22,
//     email: '  chachi@yomom.com   ',
//     password: 'abc'
// })



// // NewUser.deleteMany({ name: { $gte: 'chachi' } }).then(() => {
// //     console.log("Data deleted"); // Success
// // }).catch((error) => {
// //     console.log(error); // Failure
// // });

// //newUser.save().then(() => console.log(newUser)).catch((err) => console.log(err))

// //newTask.deleteMany({ completed: false })

// newTask.save().then(() => console.log(newTask)).catch((err) => console.log('YEEHAHH', err))

// //kitty.save().then(() => console.log(kitty));



