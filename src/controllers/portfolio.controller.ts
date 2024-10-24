import * as PortfolioService from '../services/portfolio.service'
import { Request, Response } from 'express'
import { uploadFile } from '../utils/fileHandling'
import { logger } from '../utils/logger'
import PortfolioType from '../type/portfolio.type'
import { PortofolioValidation } from '../validations/portfolio.validation'

export const postPortfolioController = async (req: Request, res: Response): Promise<void> => {
  const image_URLs: string[] = Array(12).fill('')
  let coverImageUrl: string = ''

  const isFilesObject = (files: any): files is { [key: string]: Express.Multer.File[] } => {
    return typeof files === 'object' && !Array.isArray(files)
  }

  if (req.files && isFilesObject(req.files)) {
    const image_files = req.files['image']

    if (image_files && image_files.length > 0) {
      for (let i = 0; i < image_files.length; i++) {
        const image_URL = await uploadFile(image_files[i])
        if (i < 12) {
          image_URLs[i] = image_URL
        }
      }
    }

    const cover_file = req.files['cover']
    if (cover_file && cover_file.length > 0) {
      coverImageUrl = await uploadFile(cover_file[0])
    }
  }

  const {
    location,
    area,
    year,
    highlight,
    copy_1,
    copy_2,
    copy_3,
    copy_4,
    copy_5,
    copy_6,
    category_1_id,
    category_2_id,
    category_3_id,
    client_id
  } = req.body
  const copies = [copy_1, copy_2, copy_3, copy_4, copy_5, copy_6]
  const categories = [category_1_id, category_2_id, category_3_id].map((cat) => (cat === '' ? null : cat))

  try {
    console.log(location, area, year, coverImageUrl, highlight, copies, image_URLs, categories, client_id)

    const newPortfolio = await PortfolioService.postPortfolioService(
      location,
      area,
      year,
      coverImageUrl,
      highlight,
      copies,
      image_URLs,
      categories,
      client_id
    )

    logger.info('Status 200: Inserted portfolio data')
    res.status(200).send({
      message: 'Success',
      portfolioId: newPortfolio.id
    })
  } catch (error) {
    logger.error('Status 500: Error inserting portfolio data', { error })
    res.status(500).send({
      message: 'Error inserting portfolio',
      error: error
    })
  }
}

export const putPortfolioByIdController = async (req: Request, res: Response): Promise<void> => {
  const portfolioId = parseInt(req.params.id)

  let coverURL: string = ''
  const image_URLs: string[] = Array(12).fill('')

  const isFilesObject = (files: any): files is { [key: string]: Express.Multer.File[] } => {
    return typeof files === 'object' && !Array.isArray(files)
  }

  if (req.files && isFilesObject(req.files)) {
    const coverFile = req.files['cover']
    if (coverFile && coverFile.length > 0) {
      coverURL = await uploadFile(coverFile[0])
    }

    for (let i = 1; i <= 12; i++) {
      const imageFile = req.files[`image_${i}`]
      if (imageFile && imageFile.length > 0) {
        image_URLs[i - 1] = await uploadFile(imageFile[0])
      }
    }
  }

  const {
    location,
    area,
    year,
    highlight,
    copy_1,
    copy_2,
    copy_3,
    copy_4,
    copy_5,
    copy_6,
    category_1_id,
    category_2_id,
    category_3_id,
    client_id
  } = req.body

  const updatedData: Partial<PortfolioType> = {
    location,
    area,
    year,
    cover: coverURL,
    highlight,
    copy_1,
    copy_2,
    copy_3,
    copy_4,
    copy_5,
    copy_6,
    image_1: image_URLs[0] || undefined,
    image_2: image_URLs[1] || undefined,
    image_3: image_URLs[2] || undefined,
    image_4: image_URLs[3] || undefined,
    image_5: image_URLs[4] || undefined,
    image_6: image_URLs[5] || undefined,
    image_7: image_URLs[6] || undefined,
    image_8: image_URLs[7] || undefined,
    image_9: image_URLs[8] || undefined,
    image_10: image_URLs[9] || undefined,
    image_11: image_URLs[10] || undefined,
    image_12: image_URLs[11] || undefined,
    category_1_id: category_1_id ? parseInt(category_1_id) : undefined,
    category_2_id: category_2_id ? parseInt(category_2_id) : undefined,
    category_3_id: category_3_id ? parseInt(category_3_id) : undefined,
    client_id: client_id ? parseInt(client_id) : undefined
  }

  try {
    const updatedPortfolio = await PortfolioService.putPortfolioByIdService(portfolioId, updatedData)
    logger.info(`Portfolio with ID ${portfolioId} updated successfully`)

    res.status(200).json({
      message: 'Portfolio updated successfully',
      portfolio: updatedPortfolio
    })
  } catch (error) {
    logger.error(`Error updating portfolio with ID ${portfolioId}`, { error })

    res.status(500).json({
      message: 'Error updating portfolio',
      error: error
    })
  }
}

export const getAllPortfolioController = async (req: Request, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1
  const pageSize = parseInt(req.query.pageSize as string) || 15
  const start = (page - 1) * pageSize

  try {
    const portfolios: PortfolioType[] = await PortfolioService.getallPortfolioService()

    if (portfolios.length === 0) {
      res.status(404).send({ message: 'No Portfolios Found' })
      return
    }

    const paginationResult = portfolios.slice(start, start + pageSize)

    const validatedData = paginationResult.map((data) => {
      const { error } = PortofolioValidation(data)
      if (error) {
        logger.error(`Validation error: ${error.message}`)
        res.status(400).send({
          message: 'Validation Failed',
          error: error.message
        })
      }
      return {
        id: data.id,
        data: {
          location: data.location,
          area: data.area,
          year: data.year,
          cover: data.cover,
          slug: data.slug,
          highlight: data.highlight,
          copy_1: data.copy_1,
          copy_2: data.copy_2,
          copy_3: data.copy_3,
          copy_4: data.copy_4,
          copy_5: data.copy_5,
          copy_6: data.copy_6,
          image_1: data.image_1,
          image_2: data.image_2,
          image_3: data.image_3,
          image_4: data.image_4,
          image_5: data.image_5,
          image_6: data.image_6,
          image_7: data.image_7,
          image_8: data.image_8,
          image_9: data.image_9,
          image_10: data.image_10,
          image_11: data.image_11,
          image_12: data.image_12,
          category: [data.category_name_1, data.category_name_2, data.category_name_3],
          client_id: [{ id: data.client_id, name: data.client_name }]
        }
      }
    })
    // .filter((item): item is NonNullable<typeof item> => item !== null)
    logger.info(`Status 200: Get All Portfolio success`)
    res.status(200).send({
      page,
      pageSize,
      totalData: portfolios.length,
      totalPages: Math.ceil(portfolios.length / pageSize),
      portfolio: validatedData,
      message: 'Success'
    })
  } catch (error) {
    logger.error(`Status 500: Error Fetching Portfolio Data - ${error}`)
    res.status(500).send({
      message: 'Error Fetching Portfolio Data',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

export const getPortfolioByIdController = async (req: Request, res: Response): Promise<void> => {
  const portfolioId = parseInt(req.params.id as string)

  try {
    const portfolio: PortfolioType | null = await PortfolioService.getPortfolioByIdService(portfolioId)

    if (!portfolio) {
      res.status(404).send({ message: 'Portfolio Not Found' })
      return
    }

    const { error } = PortofolioValidation(portfolio)
    if (error) {
      logger.error(`Validation error: ${error.message}`)
      res.status(400).send({
        message: 'Validation Failed',
        error: error.message
      })
      return
    }

    logger.info(`Status 200: Get Portfolio By ID success`)
    res.status(200).send({
      id: portfolio.id,
      data: {
        location: portfolio.location,
        area: portfolio.area,
        year: portfolio.year,
        cover: portfolio.cover,
        slug: portfolio.slug,
        highlight: portfolio.highlight,
        copy_1: portfolio.copy_1,
        copy_2: portfolio.copy_2,
        copy_3: portfolio.copy_3,
        copy_4: portfolio.copy_4,
        copy_5: portfolio.copy_5,
        copy_6: portfolio.copy_6,
        image_1: portfolio.image_1,
        image_2: portfolio.image_2,
        image_3: portfolio.image_3,
        image_4: portfolio.image_4,
        image_5: portfolio.image_5,
        image_6: portfolio.image_6,
        image_7: portfolio.image_7,
        image_8: portfolio.image_8,
        image_9: portfolio.image_9,
        image_10: portfolio.image_10,
        image_11: portfolio.image_11,
        image_12: portfolio.image_12,
        category: [portfolio.category_name_1, portfolio.category_name_2, portfolio.category_name_3],
        client_id: { id: portfolio.client_id, name: portfolio.client_name }
      }
    })
  } catch (error) {
    logger.error(`Status 500: Error Fetching Portfolio Data - ${error}`)
    res.status(500).send({
      message: 'Error Fetching Portfolio Data',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

export const deletePortfolioByIdController = async (req: Request, res: Response): Promise<void> => {
  const portfolioId = parseInt(req.params.id as string)

  try {
    await PortfolioService.deletePortfolioByIdService(portfolioId)
    logger.info(`Status 200: Portfolio with ID ${portfolioId} deleted successfully`)
    res.status(200).send({ message: 'Portfolio Deleted Successfully' })
  } catch (error) {
    if (error === 'Portfolio Not Found') {
      logger.warn(`Status 404: ${error}`)
      res.status(404).send({ message: error })
    } else {
      logger.error(`Status 500: Error Deleting Portfolio - ${error}`)
      res.status(500).send({
        message: 'Error Deleting Portfolio',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
}

export const deleteAllPortfoliosController = async (req: Request, res: Response): Promise<void> => {
  try {
    await PortfolioService.deleteAllPortfoliosService()
    logger.info(`Status 200: All portfolios deleted successfully`)
    res.status(200).send({ message: 'All Portfolios Deleted Successfully' })
  } catch (error) {
    logger.error(`Status 500: Error Deleting All Portfolios - ${error}`)
    res.status(500).send({
      message: 'Error Deleting All Portfolios',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
