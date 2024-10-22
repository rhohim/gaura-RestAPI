import { Router } from 'express'
import multer from 'multer'
import * as ClientController from '../controllers/client.controller'

const router = Router()
const upload = multer({ storage: multer.memoryStorage() })

router.route('/').post(upload.fields([{ name: 'client_image', maxCount: 1 }]), ClientController.postClientController)

export default router
