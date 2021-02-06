const CartsService = {
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
          `select carts.id, products.id as product_id, category, image, size, price, brand, description, products.name 
            from carts, users, products
            where carts.product_id = products.id 
            and carts.user_id = users.id
            and users.id = ${user_id}
          `
        )
        // .from('user_products', 'users', 'products')
        // .select('*')
        // .where({user_id, product_id})
        // .first()
    },
  
    deleteCartItem(knex, id) {
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
  
  module.exports = CartsService