//CRUD

// const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient
// const ObjectID = mongodb.ObjectId

const { MongoClient, ObjectId } = require('mongodb')


const id = new ObjectId()
console.log('flibberty jiblets', id.getTimestamp())
console.log(id.id)
console.log(id.toHexString().length)

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        return console.log('error error robot balls! database no connect')
    }

    console.log('connected to db yo!')

    const db = client.db(databaseName)

    // // db.collection('users').insertOne({
    // //     name: 'chachi',
    // //     age: 70000
    // // }, (error, result) => {
    // //     if (error) {
    // //         return console.log('unable to insert users')
    // //     }

    // //     console.log(result)
    // // })

    // const gettheuser = async () => {
    //     const users = db.collection('users')
    //     const query = { name: 'dante suckit' }

    //     const theUser = await users.findOne(query)

    //     console.log(theUser)
    // }

    // gettheuser().catch((err) => {
    //     console.log(err)
    // })

    const getManyUsers = async () => {
        const users = db.collection('users')
        const query = { age: 4 }

        const theUsers = await users.find(query).toArray().then((resp, err) => {
            if (err) {
                return console.log(err)
            }
            console.log('chicki chickah yeah', resp)
        })
    }

    // getManyUsers().catch((err) => {
    //     console.log(err)
    // })


    const countUserdocs = () => {
        const users = db.collection('users')
        const query = { age: 4 }


        const hmm = users.countDocuments(query);
        return hmm
    }

    // countUserdocs().then((resp, err) => {
    //     err ? console.log(err) : console.log('xxxxx', resp)
    // })

    // db.collection('users').find({ age: 4 }).countDocuments().then((resp, err) => {
    //     err ? console.log(err) : console.log('yuka yuka yuka', resp)
    // })

    const addUser = db.collection('users').insertOne({
        _id: id,
        name: 'yomomma suckit',
        age: 4
    })

    addUser.then((er, re) => {
        if (er) {
            return console.log(er)
        }
        console.log(re)
    })



    const getData = db.collection('users').insertMany([{
        name: 'suckit',
        age: 26
    }, {
        name: 'aunt jamima',
        age: 53
    },
    {
        name: 'johhny',
        age: 70
    }, {
        name: 'freddy',
        age: 34
    }])

    getData.then((error, ops) => {
        if (error) {
            return console.log(error)
        }
        // console.log('holly shiznat', ops)
    })


    const getOne = async () => {
        const tasks = db.collection('tasks')
        const query = { _id: ObjectId('6351ad98af822691e30c7abb') }

        const taskOne = await tasks.findOne(query)

        console.log('adsfasdfasdfdsaf:::', taskOne)
    }

    getOne().catch(err => console.log(err))


    const getAllTasks = async () => {
        const tasks = db.collection('tasks')
        //const query = { completed: false }

        const allTasks = await tasks.find().toArray()

        //  console.log(allTasks)

    }

    const getAllUsers = async () => {
        const users = db.collection('users')


        const allUsers = await users.find().toArray()

        // console.log('ALL USERSSRS::', allUsers)
        // await client.close()
    }



    // const tasks = db.collection('tasks').insertMany([
    //     {
    //         taskName: 'wash dishes',
    //         completed: false
    //     },
    //     {
    //         taskName: 'walk dog',
    //         completed: true
    //     },
    //     {
    //         taskName: 'laundry',
    //         completed: false
    //     },
    //     {
    //         taskName: 'get groceries',
    //         completed: false
    //     },
    // ])

    // tasks.then((err, result) => {
    //     if (err) {
    //         return console.log(err)
    //     }
    //     console.log(result)
    // })



    //const tasks = db.collection('tasks')
    // const filter = { _id: new ObjectId('6351ad98af822691e30c7ab8') }
    // const updateDoc = {
    //     $set: {
    //         taskName: 'RUN FOR THE HILLS'
    //     }
    // }

    const updateOne = db.collection('tasks').updateMany({
        completed: false
    }, {
        $set: {
            completed: true
        }
    })


    // await client.close();



    // updateOne.then(() => { getAllTasks().catch(err => console.log(err)) }).catch(console.dir)

    const deleteManyUsers = async (query) => {

        const deleteAll = await db.collection('users').deleteMany(query)

        console.log(`succesfuylly delted ${deleteAll.deletedCount} doc(s) with ${Object.keys(query)[0]} : ${query.age}`);
    }



    deleteManyUsers({ age: 70 }).catch(err => console.log(err))

})





