import { Request, Response, NextFunction } from 'express'
import * as db from '../config/database'

export const getHealth = (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const dbConnected = db.isDatabaseConnected()
    const statusCode = dbConnected ? 200 : 503

    res.status(statusCode).json({
      status: dbConnected ? 'UP' : 'DOWN',
      timestamp: new Date().toISOString(),
      service: 'Alto Porte Lead Management API',
      database: dbConnected ? 'CONNECTED' : 'DISCONNECTED',
    })
  } catch (error) {
    next(error)
  }
}
