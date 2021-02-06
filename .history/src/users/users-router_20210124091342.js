const express = require('express')
const path = require('path')
const UsersService = require('./users-service')
const xss = require('xss')

const usersRouter = express.Router()
const jsonBodyParser = express.json()

const serializeUser = user => ({
  id: user.id,
  name: xss(user.name),
  email: xss(user.email),
  password: xss(user.password),
  
})

usersRouter
  .post('/', jsonBodyParser, (req, res, next) => {
    const { password, email, name } = req.body

    for (const field of ['email', 'password', 'name'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        })

    const passwordError = UsersService.validatePassword(password)

    if (passwordError)
      return res.status(400).json({ error: passwordError })

    UsersService.hasUserWithUserEmail(
      req.app.get('db'),
      email
    )
      .then(userWithEmail => {
        if (userWithEmail)
          return res.status(400).json({ error: `Username already taken` })

        return UsersService.hashPassword(password)
          .then(hashedPassword => {
            const newUser = {
              name,
              password: hashedPassword,
              email,
              date_created: 'now()',
            }

            return UsersService.insertUser(
              req.app.get('db'),
              newUser
            )
              .then(user => {
                res
                  .status(201)
                  .location(path.posix.join(req.originalUrl, `/${user.id}`))
                  .json(serializeUser(user).id)
              })
          })
      })
      .catch(next)
  })

module.exports = usersRouter
