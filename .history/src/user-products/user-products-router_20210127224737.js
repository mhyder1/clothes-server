const path = require('path')
const express = require('express')
const xss = require('xss')
const UserProductsService = require('./user-products-service')

const userProductsRouter = express.Router()
const jsonParser = express.json()

const serializeUserProduct = userProduct => ({
    id: userProduct.id,
    user_id: xss(userProduct.user_id),
    product_id: userProduct.product_id
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
      const { user_id, prodcut_id } = req.body
      const newProd = { user_id }
  
      for (const [key, value] of Object.entries(newProd)) {
        if (value == null) {
          return res.status(400).json({
            error: { message: `Missing '${key}' in request body` }
          })
        }
      }
  
      newProd.user_id = user_id;
      newProd.product_id = prodcut_id

  
      UserProductsService.insertProd(
        req.app.get('db'),
        newProd
      )
        .then(prod => {
          res
            .status(201)
            .location(path.posix.join(req.originalUrl, `/${prod.id}`))
            .json(serializeUserProduct(prod))
        })
        .catch(next)
    })
  
    userProductsRouter
    .route('/:user_id')
    .all((req, res, next) => {
        UserProductsService.getById(
        req.app.get('db'),
        req.params.user_id
      )
        .then(userProduct => {
          if (!userProduct) {
            return res.status(404).json({
              error: { message: `User product doesn't exist` }
            })
          }
          res.userProduct = userProduct
          next()
        })
        .catch(next)
    })
    .get((req, res, next) => {
      res.json(serializeCart(res.userProduct))
    })
    // .delete((req, res, next) => {
    //   UserProductsService.deleteUser(
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
  
    //   UserProductsService.updateUser(
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