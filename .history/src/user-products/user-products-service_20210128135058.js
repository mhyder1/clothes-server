const UserProductsService = {
    getAllUsers(knex) {
      return knex.select('*').from('carts')
    },
  
    insertCart(knex, newCart) {
      return knex
        .insert(newCart)
        .into('carts')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
  
    getById(knex, user_id) {
      return knex
      .raw(
          `select category, quantity, image, size, price, brand, description, products.name from user_products, users, products
            where user_products.product_id = products.id 
            and user_products.user_id = users.id
            and users.id = ${user_id}
          `
        )
        // .from('user_products', 'users', 'products')
        // .select('*')
        // .where({user_id, product_id})
        // .first()
    },
  
    deleteUser(knex, id) {
      return knex('carts')
        .where({ id })
        .delete()
    },
  
    updateUser(knex, id, newCartFields) {
      return knex('carts')
        .where({ id })
        .update(newCartFields)
    },
    // hasUserWithUserName(db, user_name) {
    //   return db('carts')
    //     .where({ user_name })
    //     .first()
    //     .then(user => !!user)
    // },
    // insertUser(db, newUser) {
    //   return db
    //     .insert(newUser)
    //     .into('carts')
    //     .returning('*')
    //     .then(([user]) => user)
    // },
  }
  
  module.exports = UserProductsService