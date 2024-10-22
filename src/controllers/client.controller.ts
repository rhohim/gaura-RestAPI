import * as ClientService from '../services/client.service'
import { Request, Response } from 'express'
import { uploadFile } from '../utils/fileHandling'

export const postClientController = async (req: Request, res: Response): Promise<void> => {
  let client_image_URL = ''
  const isFilesObject = (files: any): files is { [key: string]: Express.Multer.File[] } => {
    return typeof files === 'object' && !Array.isArray(files)
  }

  if (req.files && isFilesObject(req.files)) {
    const client_image_file = req.files['client_image']?.[0]

    if (client_image_file) {
      client_image_URL = await uploadFile(client_image_file)
    }
  }
  const { client_name } = req.body
  try {
    const newClient = await ClientService.postClientService(client_name, client_image_URL)
    res.status(200).send({
      message: 'Success',
      clientId: newClient.id
    })
  } catch (error) {
    res.status(500).send({
      message: 'Error Inserting Client',
      error: error
    })
  }
}
