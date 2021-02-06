const CartsService = {
    getAllProducts(knex) {
      return knex.select('*').from('products')
    },
  
    insertCart(knex, newUser) {
      return knex
        .insert(newUser)
        .into('products')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
  
    getById(knex, id) {
      return knex
        .from('products')
        .select('*')
        .where('id', id)
        .first()
    },
  
    deleteProduct(knex, id) {
      return knex('products')
        .where({ id })
        .delete()
    },
  
    updateProduct(knex, id, newProductFields) {
      return knex('products')
        .where({ id })
        .update(newProductFields)
    },
  }
  
  module.exports = CartsService