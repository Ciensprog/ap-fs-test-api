import { Request, Response, NextFunction } from 'express'

export interface AppError extends Error {
  statusCode?: number
  details?: any
}

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const statusCode = err.statusCode || 500
  const message = err.message || 'Error interno del servidor'

  console.error(`[Error Handler] ${statusCode} - ${message}`, err.stack)

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(err.details && { details: err.details }),
    },
  })
}

export const notFoundHandler = (_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Ruta no encontrada en la API',
    },
  })
}
