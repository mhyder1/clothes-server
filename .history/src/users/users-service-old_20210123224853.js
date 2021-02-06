const CartsService = {
    getAllUsers(knex) {
      return knex.select('*').from('users')
    },
  
    insertUser(knex, newUser) {
      return knex
        .insert(newUser)
        .into('users')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
  
    getById(knex, id) {
      return knex
        .from('users')
        .select('*')
        .where('id', id)
        .first()
    },
  
    deleteUser(knex, id) {
      return knex('users')
        .where({ id })
        .delete()
    },
  
    updateUser(knex, id, newUserFields) {
      return knex('users')
        .where({ id })
        .update(newUserFields)
    },
    hasUserWithUserName(db, user_name) {
      return db('blogful_users')
        .where({ user_name })
        .first()
        .then(user => !!user)
    },
    insertUser(db, newUser) {
      return db
        .insert(newUser)
        .into('blogful_users')
        .returning('*')
        .then(([user]) => user)
    }
  }
  
  module.exports = CartsService