const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/api/users', async (request, response, next) => {
    try {
        const body = request.body
        console.log(body.password)
        if (body.password.length < 4) {
            return response.status(400).json({error: 'password is not long enough'})
        }

        const saltRounds = 10
        const passwordHash = await bcrypt.hash(body.password, saltRounds)

        const user = new User({
            username: body.username,
            name: body.name,
            passwordHash
        })

        const savedUser = await user.save()

        response.status(201).json(savedUser)
    } catch (exception) {
        next(exception)
    }
})

usersRouter.get('/api/users', async (request, response) => {
    const users = await User.find({}).populate('blogs', {author: 1, url: 1})
    response.json(users.map(user => user.toJSON()))
})

module.exports = usersRouter