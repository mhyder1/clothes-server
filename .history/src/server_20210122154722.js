const knex = require('knex')
const app = require('./app')
const { PORT , DB_URL} = require('./config')

const db = knex({
  client: 'pg',
  connection: DB_URL,
})

app.set('db', db)

app.listen(8000, () => {
  console.log(`Server listening at http://localhost:${8000}`)
})