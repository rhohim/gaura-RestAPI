import { Router } from 'express'
import * as CategoryController from '../controllers/category.controller'

const router = Router()

router
  .route('/')
  .get(CategoryController.getallCategoryController)
  .post(CategoryController.postCategoryController)
  .delete(CategoryController.deleteallCategoryController)

router
  .route('/:id')
  .get(CategoryController.getCategoryByIdController)
  .delete(CategoryController.deletCategoryByIdController)
  .put(CategoryController.putCategoryByIdControoler)

export default router
