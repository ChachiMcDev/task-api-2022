const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/usermodel')
const { useroneId, userOne, setupDatabase } = require('./fixtures/db')


beforeEach(setupDatabase)

test('should sign up new user', async () => {
    const response = await request(app).post('/users')
        .send({
            name: 'chachi',
            email: 'xxxxuetiwerhf@mccool.com',
            password: 'Hug3mS0hard!'
        }).expect(201)

    //Assert that user was added into database
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    //Assert that the response matches the user
    expect(response.body).toMatchObject({
        user: {
            name: 'chachi',
            email: 'xxxxuetiwerhf@mccool.com'
        },
        token: user.tokens[0].token
    })

    expect(user.password).not.toBe('Hug3mS0hard!')

})


test('should login existing user', async () => {
    const response = await request(app).post('/users/login')
        .send({
            email: userOne.email,
            password: userOne.password
        }).expect(200)

    const user = await User.findById(useroneId)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('should NOT login non existent user', async () => {
    await request(app).post('/users/login')
        .send({
            email: 'suckit@youmom.com',
            password: 'Hei34mD0@!'
        }).expect(400)
})

test('get user profile using auth', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', 'adaeefadddegedsdedgdessedg')
        .send()
        .expect(401)
})

test('should log user out', async () => {
    await request(app)
        .post('/users/logout')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('should update authenticated user profile information', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            "name": "freddy mercury"
        })
        .expect(200)

    const user = await User.findById(useroneId)
    expect(user.name).toBe('freddy mercury')
})

test('should NOT update authenticated user profile with wrong key information', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            "hugem": "restricted field"
        })
        .expect(400)
})

test('should delete authenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findById(useroneId)
    expect(user).toBeNull()

})

test('should NOT delete a user for unauthed user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('should upload avatar for authenticatd user', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/scoobs.jpg')
        .expect(200)

    const user = await User.findById(useroneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})