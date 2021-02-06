const ProductsService = {
    getAllProducts(knex) {
      return knex.select('*').from('african_clothings_products')
    },
  
    insertProduct(knex, newUser) {
      return knex
        .insert(newUser)
        .into('african_clothings_products')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
  
    getById(knex, id) {
      return knex
        .from('african_clothings_products')
        .select('*')
        .where('id', id)
        .first()
    },
  
    deleteProduct(knex, id) {
      return knex('african_clothings_products')
        .where({ id })
        .delete()
    },
  
    updateProduct(knex, id, newUserFields) {
      return knex('african_clothings_products')
        .where({ id })
        .update(newProductFields)
    },
  }
  
  module.exports = ProductsService