const blogsRouter = require('express').Router()
const Blog = require('../models/blog');

blogsRouter.get('/api/blogs', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.post('/api/blogs', async (request, response, next) => {
    const blog = new Blog(request.body)
    try {
        const savedBlog = await blog.save()
        response.status(201).json(blogSaved)
    } catch (exception) {
        next(exception)
    }
})

blogsRouter.delete('/api/blogs/:id', async (request, response, next) => {
    try {
        await Blog.findByIdAndRemove(request.params.id)
        response.status(204).end()
    } catch(exception) {
        next(exception)
    }

})

module.exports = blogsRouter