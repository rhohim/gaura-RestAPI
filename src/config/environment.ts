import 'dotenv/config'

export const configDB = {
  db: process.env.DATABASE as string,
  host: process.env.HOST as string,
  user: process.env.USERDB as string,
  password: process.env.PASSWORD as string
}

export const port: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000

export const configFile = {
  public_key: process.env.publicKey as string,
  private_key: process.env.privateKey as string,
  url_endpoint: process.env.urlEndpoint as string
}
