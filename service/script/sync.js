import sql from './utils/db.js'

await sql.sync({ alter: true })
