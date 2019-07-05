const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const mongoose = require('mongoose')
const Blog = require('../models/blog')

const initialBlogs = [
    {
        title: 'My Makers Journey',
        author: 'Jim Davids',
        url: 'www.blogs.co.uk',
        likes: 123
    },
    {
        title: 'TDD? Whats the fuss?',
        author: 'Sammy Samiels',
        url: 'www.ewqe.co.uk',
        likes: 0
    },
    {
        title: 'Daring Pairing',
        author: 'Jimmy',
        url: 'www.googdasdle.co.uk',
        likes: 1233
    }
]

beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = initialBlogs
        .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

test('blogs are returned as JSON', async () => {
    await api.get('/api/blogs')
        .expect('Content-Type', /json/)
        .expect(200)
})

test('correct number of blogs returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body.length).toEqual(3)
})

test('unique identifier is name id', async () => {
    const response = await api.get('/api/blogs')
    console.log(response)
    expect(response.body[0].id).toBeDefined()
})

afterAll(() => {
    mongoose.connection.close()
})

