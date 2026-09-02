import { Request, Response, NextFunction } from 'express'
import { dashboardService } from '../services/dashboard.service'

export const getDashboardSummary = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const summary = await dashboardService.getDashboardSummary()

    res.status(200).json({
      success: true,
      data: summary,
    })
  } catch (error) {
    next(error)
  }
}
