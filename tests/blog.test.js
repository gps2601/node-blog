const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const mongoose = require('mongoose')

test('blogs are returned as JSON', async () => {
    await api.get('/api/blogs')
        .expect('Content-Type', /json/)
        .expect(200)
})

afterAll(() => {
    mongoose.connection.close()
})

