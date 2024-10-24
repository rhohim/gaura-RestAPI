import { Router } from 'express'
import * as PortfolioController from '../controllers/portfolio.controller'
import multer from 'multer'

const router = Router()
const upload = multer({ storage: multer.memoryStorage() })

router
  .route('/')
  .post(
    upload.fields([
      { name: 'image', maxCount: 12 },
      { name: 'cover', maxCount: 1 }
    ]),
    PortfolioController.postPortfolioController
  )
  .get(PortfolioController.getAllPortfolioController)
  .delete(PortfolioController.deleteAllPortfoliosController)

router
  .route('/:id')
  .put(
    upload.fields([
      { name: 'image_1', maxCount: 1 },
      { name: 'image_2', maxCount: 1 },
      { name: 'image_3', maxCount: 1 },
      { name: 'image_4', maxCount: 1 },
      { name: 'image_5', maxCount: 1 },
      { name: 'image_6', maxCount: 1 },
      { name: 'image_7', maxCount: 1 },
      { name: 'image_8', maxCount: 1 },
      { name: 'image_9', maxCount: 1 },
      { name: 'image_10', maxCount: 1 },
      { name: 'image_11', maxCount: 1 },
      { name: 'image_12', maxCount: 1 },
      { name: 'cover', maxCount: 1 }
    ]),
    PortfolioController.putPortfolioByIdController
  )
  .get(PortfolioController.getPortfolioByIdController)
  .delete(PortfolioController.deletePortfolioByIdController)
export default router
