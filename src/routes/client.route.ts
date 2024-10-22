import { Router } from 'express'
import multer from 'multer'
import * as ClientController from '../controllers/client.controller'

const router = Router()
const upload = multer({ storage: multer.memoryStorage() })

router
  .route('/')
  .get(ClientController.getallClientController)
  .post(upload.fields([{ name: 'client_image', maxCount: 1 }]), ClientController.postClientController)
  .delete(ClientController.deleteallClientController)

router
  .route('/:id')
  .get(ClientController.getClientByIdController)
  .delete(ClientController.deleteClientByIdController)
  .put(upload.fields([{ name: 'client_image', maxCount: 1 }]), ClientController.updateClientController)

export default router
