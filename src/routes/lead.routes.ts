import { Router } from 'express'
import {
  getLeads,
  getLeadById,
  createLead,
  updateLeadStatus,
} from '../controllers/lead.controller'
import {
  validateMongoId,
  validateCreateLead,
  validateUpdateStatus,
} from '../middlewares/validate.middleware'

const router = Router()

router.get('/', getLeads)
router.post('/', validateCreateLead, createLead)
router.get('/:id', validateMongoId, getLeadById)
router.patch(
  '/:id/status',
  validateMongoId,
  validateUpdateStatus,
  updateLeadStatus,
)

export default router
