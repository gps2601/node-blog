const blogsRouter = require('express').Router()
const Blog = require('../models/blog');

blogsRouter.get('/api/blogs', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.post('/api/blogs', async (request, response) => {
    const blog = new Blog(request.body)
    const blogSaved = await blog.save()
    response.status(201).json(blogSaved)
})

module.exports = blogsRouter