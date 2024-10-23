import { Router } from 'express'
import * as PortfolioController from '../controllers/portfolio.controller'
import multer from 'multer'

const router = Router()
const upload = multer({ storage: multer.memoryStorage() })

router.route('/').post(
  upload.fields([
    { name: 'image', maxCount: 5 },
    { name: 'cover', maxCount: 1 }
  ]),
  PortfolioController.postPortfolioController
)

export default router
