import * as ClientService from '../services/client.service'
import { Request, Response } from 'express'
import { uploadFile } from '../utils/fileHandling'
import { logger } from '../utils/logger'
import ClientType from '../type/client.type'
import { ClientValidation } from '../validations/client.validation'

export const getallClientController = async (req: Request, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1
  const pageSize = parseInt(req.query.pageSize as string) || 15
  const start = (page - 1) * pageSize
  const end = start + pageSize

  try {
    const client: ClientType[] = await ClientService.getallClientService()
    if (client.length === 0) {
      res.status(404).send({
        message: 'Client Not Found'
      })
      return
    }

    const paginationResult = client.slice(start, end)
    // const formattedData = paginationResult.map((data) => ({
    //   id: data.id,
    //   data: {
    //     client_name: data.client_name,
    //     client_image: data.client_image
    //   }
    // }))
    const validationData = paginationResult.map((data) => {
      const { error } = ClientValidation(data)

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
          client_name: data.client_name,
          client_image: data.client_image
        }
      }
    })
    logger.info('Status 200: Get All Client Data')
    res.status(200).send({
      page,
      pageSize,
      totalData: client.length,
      totalPages: Math.ceil(client.length / pageSize),
      client: validationData,
      message: 'Success'
    })
  } catch (error) {
    logger.error('Status 500 : Error Fetching client data')
    res.status(500).send({
      message: 'Error Fetching Client Data',
      error: error
    })
  }
}

export const postClientController = async (req: Request, res: Response): Promise<void> => {
  let client_image_URL = ''
  const isFilesObject = (files: any): files is { [key: string]: Express.Multer.File[] } => {
    return typeof files === 'object' && !Array.isArray(files)
  }
  try {
    if (req.files && isFilesObject(req.files)) {
      const client_image_file = req.files['client_image']?.[0]

      if (client_image_file) {
        client_image_URL = await uploadFile(client_image_file)
      }
    }
    const { client_name } = req.body
    const payload = { id: 0, client_name, client_image: client_image_URL }
    const { error } = ClientValidation(payload)
    if (error) {
      logger.error(`Validation error: ${error.message}`)
      res.status(400).send({
        message: 'Validation Failed',
        error: error.message
      })
      return
    }
    const newClient = await ClientService.postClientService(client_name, client_image_URL)
    logger.info('Status 200 : Insert client data')
    res.status(200).send({
      message: 'Success',
      clientId: newClient.id
    })
  } catch (error) {
    logger.error('Status 500 : Error Inserting client data')
    res.status(500).send({
      message: 'Error Inserting Client',
      error: error
    })
  }
}

export const deleteallClientController = async (req: Request, res: Response): Promise<void> => {
  try {
    await ClientService.deleteAllClientService()
    logger.info('Status 200: Deleting all client data')
    res.status(200).send({
      message: 'All client deleted'
    })
  } catch (error) {
    logger.error('Error Delete all client data')
    res.status(500).send({
      message: 'Error Deleting all client data',
      error: error
    })
  }
}

export const getClientByIdController = async (req: Request, res: Response): Promise<void> => {
  const clientId = parseInt(req.params.id)
  if (isNaN(clientId)) {
    res.status(400).send({
      message: 'Invalid client ID'
    })
  }

  try {
    const client = await ClientService.getClientByIdService(clientId)
    logger.info('Status 200: Successfully Fetching Client data')
    const { error } = ClientValidation(client)

    if (error) {
      logger.error(`Validation error for category ID ${clientId}: ${error.message}`)
      res.status(400).send({
        message: 'Validation Failed',
        error: error.message
      })
      return
    }
    res.status(200).send({
      id: client.id,
      data: {
        client_name: client.client_name,
        client_image: client.client_image
      }
    })
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).send({
        message: 'Client Not Found'
      })
    } else {
      logger.error('Error Fetching client data')
      res.status(500).send({
        message: 'Error Fething client data',
        error: error
      })
    }
  }
}

export const deleteClientByIdController = async (req: Request, res: Response): Promise<void> => {
  const clientId = parseInt(req.params.id)
  if (isNaN(clientId)) {
    res.status(400).send({
      message: 'Invalid Client ID'
    })
  }

  try {
    await ClientService.deleteClientByIdService(clientId)
    logger.info('Deleted client by ID')
    res.status(200).send({
      message: 'Deleted'
    })
  } catch (error) {
    logger.error('Error Delete all client data')
    res.status(500).send({
      message: 'Error Deleting all client data',
      error: error
    })
  }
}

export const updateClientController = async (req: Request, res: Response): Promise<void> => {
  let client_image_URL = ''
  const isFilesObject = (files: any): files is { [key: string]: Express.Multer.File[] } => {
    return typeof files === 'object' && !Array.isArray(files)
  }

  const clientId = parseInt(req.params.id)
  const { client_name } = req.body
  try {
    if (req.files && isFilesObject(req.files)) {
      const client_image_file = req.files['client_image']?.[0]

      if (client_image_file) {
        client_image_URL = await uploadFile(client_image_file)
      }
    }

    const clientData = {
      client_name,
      client_image: client_image_URL || undefined
    }

    const payload = {
      id: clientId,
      client_name,
      client_image: client_image_URL !== null ? client_image_URL : ''
    }

    const { error } = ClientValidation(payload)

    if (error) {
      logger.error(`Validation error for client update: ${error.message}`)
      res.status(400).send({
        message: 'Validation Failed',
        error: error.message
      })
      return
    }

    const updatedClient = await ClientService.putClientByIdService(Number(clientId), clientData)
    res.status(200).send({
      message: 'Client Updated Successfully',
      client: updatedClient
    })
  } catch (error) {
    res.status(500).send({
      message: 'Error Updating Client',
      error: error
    })
  }
}
