import { Application, Router } from 'express'
import CategoryRoute from './category.route'
import ClientRoute from './client.route'
import PortfolioRoute from '../routes/portfolio.route'

const _routes: Array<[string, Router]> = [
  ['/api/v1/category', CategoryRoute],
  ['/api/v1/client', ClientRoute],
  ['/api/v1/portfolio', PortfolioRoute]
]

export const routes = (app: Application) => {
  _routes.forEach((route) => {
    const [url, router] = route
    app.use(url, router)
  })
}
