const path = require('path')
const express = require('express')
const xss = require('xss')
const CartsService = require('./carts-service')

const usersRouter = express.Router()
const jsonParser = express.json()

const serializecart = cart => ({
    id: cart.id,
    name: xss(cart.name),
    email: xss(cart.email),
    password: xss(cart.password),
    
  })
  
  usersRouter
    .route('/')
    .get((req, res, next) => {
      const knexInstance = req.app.get('db')
      UsersService.getAllUsers(knexInstance)
        .then(users => {
          res.json(users.map(serializeUser))
        })
        .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
      const { name, email, password } = req.body
      const newUser = { name, email }
  
      for (const [key, value] of Object.entries(newUser)) {
        if (value == null) {
          return res.status(400).json({
            error: { message: `Missing '${key}' in request body` }
          })
        }
      }
  
      newUser.name = name;
      newUser.password = password;
  
      UsersService.insertUser(
        req.app.get('db'),
        newUser
      )
        .then(user => {
          res
            .status(201)
            .location(path.posix.join(req.originalUrl, `/${user.id}`))
            .json(serializeUser(user))
        })
        .catch(next)
    })
  
  usersRouter
    .route('/:user_id')
    .all((req, res, next) => {
      UsersService.getById(
        req.app.get('db'),
        req.params.user_id
      )
        .then(user => {
          if (!user) {
            return res.status(404).json({
              error: { message: `User doesn't exist` }
            })
          }
          res.user = user
          next()
        })
        .catch(next)
    })
    .get((req, res, next) => {
      res.json(serializeUser(res.user))
    })
    .delete((req, res, next) => {
      UsersService.deleteUser(
        req.app.get('db'),
        req.params.user_id
      )
        .then(() => {
          res.status(204).end()
        })
        .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
      const { name, email, password} = req.body
      const userToUpdate = { name, email, password }
  
      const numberOfValues = Object.values(userToUpdate).filter(Boolean).length
      if (numberOfValues === 0) {
        return res.status(400).json({
          error: {
            message: `Request body must contain either 'name', 'password' or 'email'`
          }
        })
      }
  
      UsersService.updateUser(
        req.app.get('db'),
        req.params.user_id,
        userToUpdate
      )
        .then(numRowsAffected => {
          res.status(204).end()
        })
        .catch(next)
    })
  
  module.exports = usersRouter