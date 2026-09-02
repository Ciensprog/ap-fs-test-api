import { Router } from 'express'
import healthRoutes from './health.routes'
import leadRoutes from './lead.routes'
import dashboardRoutes from './dashboard.routes'

const router = Router()

router.use('/health', healthRoutes)
router.use('/leads', leadRoutes)
router.use('/dashboard', dashboardRoutes)

export default router
