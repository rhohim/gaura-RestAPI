import express, { Application, Request, Response, NextFunction } from 'express'
import { routes } from './routes/route'
import { logger } from './utils/logger'
import bodyParser from 'body-parser'
import cors from 'cors'
import { port } from './config/environment'

const app: Application = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(cors())
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', '*')
  res.setHeader('Access-Control-Allow-Headers', '*')
  next()
})

routes(app)

app.use('/', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    message: 'Typescript'
  })
})

app.listen(port, () => logger.info(`Server listening on port ${port}`))
