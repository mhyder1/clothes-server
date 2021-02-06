const path = require('path')
const express = require('express')
const xss = require('xss')
const UserProductsService = require('./user-products-service')

const userProductsRouter = express.Router()
const jsonParser = express.json()

const serializeCart = cart => ({
    id: cart.id,
    user_id: xss(cart.user_id) 
  })
  
  userProductsRouter
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

  
      CartsService.insertCart(
        req.app.get('db'),
        newCart
      )
        .then(cart => {
          res
            .status(201)
            .location(path.posix.join(req.originalUrl, `/${cart.id}`))
            .json(serializeCart(cart))
        })
        .catch(next)
    })
  
    userProductsRouter
    .route('/:user_id')
    .all((req, res, next) => {
      CartsService.getById(
        req.app.get('db'),
        req.params.user_id
      )
        .then(cart => {
          if (!cart) {
            return res.status(404).json({
              error: { message: `Cart doesn't exist` }
            })
          }
          res.cart = cart
          next()
        })
        .catch(next)
    })
    .get((req, res, next) => {
      res.json(serializeCart(res.cart))
    })
    // .delete((req, res, next) => {
    //   CartsService.deleteUser(
    //     req.app.get('db'),
    //     req.params.user_id
    //   )
    //     .then(() => {
    //       res.status(204).end()
    //     })
    //     .catch(next)
    // })
    // .patch(jsonParser, (req, res, next) => {
    //   const { name, email, password} = req.body
    //   const userToUpdate = { name, email, password }
  
    //   const numberOfValues = Object.values(userToUpdate).filter(Boolean).length
    //   if (numberOfValues === 0) {
    //     return res.status(400).json({
    //       error: {
    //         message: `Request body must contain either 'name', 'password' or 'email'`
    //       }
    //     })
    //   }
  
    //   CartsService.updateUser(
    //     req.app.get('db'),
    //     req.params.user_id,
    //     userToUpdate
    //   )
    //     .then(numRowsAffected => {
    //       res.status(204).end()
    //     })
    //     .catch(next)
    // })
  
  module.exports = userProductsRouter