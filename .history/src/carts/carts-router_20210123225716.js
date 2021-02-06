const path = require('path')
const express = require('express')
const xss = require('xss')
const CartsService = require('./carts-service')

const usersRouter = express.Router()
const jsonParser = express.json()

const serializecart = cart => ({
    id: cart.id,
    user_id: xss(cart.user_id) 
  })
  
  usersRouter
    .route('/')
    .get((req, res, next) => {
    //   const knexInstance = req.app.get('db')
    //   CartsService.getAllUsers(knexInstance)
    //     .then(users => {
    //       res.json(users.map(serializeUser))
    //     })
    //     .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
      const { user_id } = req.body
      const newCart = { user_id }
  
      for (const [key, value] of Object.entries(newCart)) {
        if (value == null) {
          return res.status(400).json({
            error: { message: `Missing '${key}' in request body` }
          })
        }
      }
  
      newCart.user_id = user_id;

  
      CartsService.insertUser(
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
      CartsService.getById(
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
      CartsService.deleteUser(
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
  
      CartsService.updateUser(
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