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

  const { location, area, year, highlight, copy_1, copy_2, copy_3, copy_4, copy_5, copy_6, category_id, client_id } =
    req.body
  const copies = [copy_1, copy_2, copy_3, copy_4, copy_5, copy_6]

  try {
    const newPortfolio = await PortfolioService.postPortfolioService(
      location,
      area,
      year,
      coverImageUrl,
      highlight,
      copies,
      image_URLs,
      category_id,
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
