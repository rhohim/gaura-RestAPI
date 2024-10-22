import mysql, { Connection } from 'mysql2'
import { configDB } from '../config/environment'

function creatConnection(): Connection {
  const db: Connection = mysql.createConnection({
    host: configDB.host,
    user: configDB.user,
    password: configDB.password,
    database: configDB.db
  })

  db.on('error', function (err: mysql.QueryError) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Connection lost, reconnecting...')
      handleReconnect()
    } else {
      throw err
    }
  })

  return db
}

function handleReconnect(): Connection {
  const db = creatConnection()

  setInterval(
    () => {
      db.query('SELECT 1', (err: mysql.QueryError | null) => {
        if (err) {
          console.error('Keep-alive query failed', err)
          handleReconnect()
        } else {
          console.log('Keep-alive query sent')
        }
      })
    },
    1000 * 60 * 60
  )

  return db
}

const db: Connection = handleReconnect()

export default db
