import { Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose'
import { ALLOWED_STATUSES } from '../models/lead.model'

export const validateMongoId = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({
      success: false,
      error: {
        message:
          'El ID proporcionado no es un identificador de MongoDB válido',
      },
    })
    return
  }
  next()
}

export const validateCreateLead = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, email, source, status, budget, project } = req.body
  const errors: string[] = []

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('El nombre es obligatorio y debe ser texto')
  }

  if (
    !email ||
    typeof email !== 'string' ||
    !/^\S+@\S+\.\S+$/.test(email.trim())
  ) {
    errors.push(
      'El correo electrónico es obligatorio y debe tener un formato válido (ejemplo@dominio.com)',
    )
  }

  if (
    budget === undefined ||
    budget === null ||
    typeof budget !== 'number' ||
    isNaN(budget) ||
    budget <= 0
  ) {
    errors.push(
      'El presupuesto es obligatorio, debe ser un valor numérico y mayor que cero',
    )
  }

  if (
    !project ||
    typeof project !== 'string' ||
    project.trim().length === 0
  ) {
    errors.push('El proyecto inmobiliario es obligatorio')
  }

  if (
    !source ||
    typeof source !== 'string' ||
    source.trim().length === 0
  ) {
    errors.push('La fuente u origen es obligatoria')
  }

  if (status !== undefined && !ALLOWED_STATUSES.includes(status as any)) {
    errors.push(
      `El estado no es válido. Opciones permitidas: ${ALLOWED_STATUSES.join(', ')}`,
    )
  }

  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      error: {
        message: 'Validación fallida en los datos enviados',
        details: errors,
      },
    })
    return
  }

  next()
}

export const validateUpdateStatus = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { status } = req.body

  if (!status || !ALLOWED_STATUSES.includes(status as any)) {
    res.status(400).json({
      success: false,
      error: {
        message: 'Estado comercial no permitido o no especificado',
        details: `El estado debe ser uno de los siguientes: ${ALLOWED_STATUSES.join(', ')}`,
      },
    })
    return
  }

  next()
}
