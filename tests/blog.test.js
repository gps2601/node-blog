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
    expect(response.body[0].id).toBeDefined()
})

test('posting a blog increases number of blogs', async () => {
    const newBlog = {
        title: 'added in the post test',
        author: 'makavelli',
        url: 'www.youtube.co.uk',
        likes: 232
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await Blog.find({})
    expect(blogsAtEnd.length).toEqual(initialBlogs.length + 1)

    const contents = blogsAtEnd.map(n => n.title)
    expect(contents).toContain('added in the post test')
})

test('if no like parameter with post, it will default to a value', async () => {
    const newBlog = {
        title: 'added in the post test for like being absent',
        author: 'makavelli',
        url: 'www.youtube.co.uk',
    }
    const response = await api.post('/api/blogs').send(newBlog)

    expect(response.body.likes).toBeDefined()
})

test('if no like parameter, it will default to zero', async () => {
    const newBlog = {
        title: 'added in the post test for like being absent',
        author: 'makavelli',
        url: 'www.youtube.co.uk',
    }

    const response = await api.post('/api/blogs').send(newBlog)

    expect(response.body.likes).toEqual(0)
})

test('if title and url missing from request, backend responds with 400', async () => {
    const newBlog = {
        author: 'makavelli',
        url: 'www.youtube.co.uk',
        likes: 232
    }

    await api.post('/api/blogs').send(newBlog).expect(400)
})

test('deleting posts will delete the post', async () => {
    const blogsInDb = await Blog.find({})
    const blogs = blogsInDb.map(blog => blog.toJSON())

    await api.delete(`/api/blogs/${blogs[0].id}`)
        .expect(204)

    const remainingBlogsInDb = await Blog.find({})
    const remainingBlogs = remainingBlogsInDb.map(blog => blog.toJSON())

    expect(remainingBlogs.length).toEqual(blogs.length - 1)
})

test('updating posts will change amount of likes', async () => {
    const blogsInDb = await Blog.find({})
    const blogs = blogsInDb.map(blog => blog.toJSON())
    let blogToUpdate = blogs[0];
    const initialAmount = blogToUpdate.likes
    blogToUpdate.likes ++;

    await api.put(`/api/blogs/${blogToUpdate.id}`)
        .send(blogToUpdate)

    const updatedBlogInDb = await Blog.findById(blogToUpdate.id)
    const updatedBlog = updatedBlogInDb.toJSON()
    expect(updatedBlog.likes).toEqual(initialAmount + 1)
    console.log(updatedBlog)
})

afterAll(() => {
    mongoose.connection.close()
})

