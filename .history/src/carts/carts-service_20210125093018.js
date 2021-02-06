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
        .from('carts')
        .select('*')
        .where('user_id', user_id)
        .first()
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
  
  module.exports = CartsService