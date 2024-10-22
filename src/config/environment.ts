import 'dotenv/config'

export const configDB = {
  db: process.env.DATABASE as string,
  host: process.env.HOST as string,
  user: process.env.USERDB as string,
  password: process.env.PASSWORD as string
}

export const port: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000
