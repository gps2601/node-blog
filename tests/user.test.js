const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const mongoose = require('mongoose')
const User = require('../models/user')

beforeEach(async () => {
    await User.deleteMany({})
})

test('can add user with proper details', async () => {
    const usersInDb = await User.find({})
    const existingsUsers = usersInDb.map(user => user.toJSON())

    const newUser = {
        username: 'longEnough',
        password: 'alsoLongEnough',
        name: 'Craig David'
    }
    const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const updatedUsersInDb = await User.find({})
    const updatedUsers =updatedUsersInDb.map(user => user.toJSON()).map(user => user.username)
    expect(updatedUsers).toContain('longEnough')
})

test('cant add user with short username', async () => {
    const newUser = {
        username: '12',
        password: 'longEnough',
        name: 'Craig David'
    }
    const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
})

afterAll(() => {
    mongoose.connection.close()
})