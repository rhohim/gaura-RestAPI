import { Response, Request } from 'express'
import * as CategoryService from '../services/category.service'
import CategoryType from '../type/category.type'
import { logger } from '../utils/logger'

export const getallCategoryController = async (req: Request, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1
  const pageSize = parseInt(req.query.pageSize as string) || 15
  const start = (page - 1) * pageSize
  const end = start + pageSize

  try {
    const category: CategoryType[] = await CategoryService.getallCategoryService()

    if (category.length === 0) {
      res.status(404).send({
        message: 'Category Not Found'
      })
      return
    }

    const paginationResult = category.slice(start, end)
    const formattedData = paginationResult.map((data) => ({
      id: data.id,
      data: {
        category_name: data.category_name
      }
    }))
    logger.info(`Status 200: Get All Category success`)
    res.status(200).send({
      page,
      pageSize,
      totalData: category.length,
      totalPages: Math.ceil(category.length / pageSize),
      category: formattedData,
      message: 'Success'
    })
  } catch (error) {
    logger.error(`Status 500: Error Fetching Category Data - ${error}`)
    res.status(500).send({
      message: 'Error Fetching Category Data',
      error: error
    })
  }
}

export const postCategoryController = async (req: Request, res: Response): Promise<void> => {
  const { category_name } = req.body

  try {
    const newCategory = await CategoryService.postCategoryService(category_name)
    logger.info(`Category created`)

    res.status(200).send({
      message: 'Category Created Successfully',
      categoryId: newCategory.id
    })
  } catch (error) {
    res.status(500).send({
      message: 'Error Inserting Category',
      error: error
    })
  }
}

export const deleteallCategoryController = async (req: Request, res: Response): Promise<void> => {
  try {
    await CategoryService.deleteAllCategoryService()
    logger.info('All categories deleted successfully')

    res.status(200).send({
      message: 'All Categories Deleted Successfully'
    })
  } catch (error) {
    res.status(500).send({
      message: 'Error Deleteing All Category',
      error: error
    })
  }
}

export const getCategoryByIdController = async (req: Request, res: Response): Promise<void> => {
  const categoryId = parseInt(req.params.id)
  if (isNaN(categoryId)) {
    res.status(400).send({ message: 'Invalid Category ID' })
    return
  }

  try {
    const category = await CategoryService.getCategoryByIdService(categoryId)
    logger.info(`Fetched category with ID: ${categoryId}`)

    res.status(200).send({
      id: category.id,
      data: {
        category_name: category.category_name
      },
      message: 'Success'
    })
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Category Not Found') {
        res.status(404).send({ message: 'Category Not Found' })
      } else {
        logger.error(`Error fetching category: ${error.message}`)
        res.status(500).send({
          message: 'Error Fetching Category',
          error: error.message || error
        })
      }
    }
  }
}

export const deletCategoryByIdController = async (req: Request, res: Response): Promise<void> => {
  const categoryId = parseInt(req.params.id)

  if (isNaN(categoryId)) {
    res.status(400).send({ message: 'Invalid Category ID' })
    return
  }

  try {
    await CategoryService.deleteCategoryByIdService(categoryId)
    logger.info(`Deleted category with ID: ${categoryId}`)

    res.status(200).send({
      message: 'Deleted'
    })
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Category Not Found') {
        res.status(404).send({ message: 'Category Not Found' })
      } else {
        logger.error(`Error deleting category: ${error.message}`)
        res.status(500).send({
          message: 'Error Deleting Category',
          error: error.message
        })
      }
    } else {
      logger.error(`Unexpected error: ${String(error)}`)
      res.status(500).send({
        message: 'Unexpected Error Deleting Category',
        error: String(error)
      })
    }
  }
}

export const putCategoryByIdControoler = async (req: Request, res: Response): Promise<void> => {
  const categoryId = parseInt(req.params.id)
  const categoryData = req.body

  if (isNaN(categoryId)) {
    res.status(400).send({ message: 'Invalid Category ID' })
    return
  }

  try {
    const updatedCategory = await CategoryService.updateCategoryByIdService(categoryId, categoryData)
    logger.info(`Updated category with ID: ${categoryId}`)

    res.status(200).send({
      message: 'Update Successful',
      category: updatedCategory
    })
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Category Not Found') {
        res.status(404).send({ message: 'Category Not Found' })
      } else {
        logger.error(`Error updating category: ${error.message}`)
        res.status(500).send({
          message: 'Error Updating Category',
          error: error.message
        })
      }
    } else {
      logger.error(`Unexpected error: ${String(error)}`)
      res.status(500).send({
        message: 'Unexpected Error Updating Category',
        error: String(error)
      })
    }
  }
}
