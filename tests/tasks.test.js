const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/taskmodel')
const { useroneId,
    userOne,
    userTwo,
    taskOne,
    setupDatabase
} = require('./fixtures/db')


beforeEach(setupDatabase)

test('should create task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            "description": "Do Dishes",
            "completed": false,
            "note": "wash on hot water"
        })
        .expect(201)

    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
})

test('should get task all tasks back for specified user', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    expect(response.body.length).toBe(2)


})

test('user2 should not be able to delete a user1 task', async () => {

    const response = await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)

    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})

test('should fetch only completed task for userOne', async () => {
    const response = await request(app)
        .get('/tasks?completed=true')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const tasks = Task.find({ owner: response.body._id })
    expect(tasks).not.toBeNull()
})