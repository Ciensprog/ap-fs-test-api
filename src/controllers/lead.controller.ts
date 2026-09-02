import { Request, Response, NextFunction } from 'express'
import { leadService } from '../services/lead.service'

export const getLeads = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { search, status, source, project, page, limit, sortBy, sortOrder } =
      req.query

    const result = await leadService.getLeads({
      search: search as string,
      status: status as string,
      source: source as string,
      project: project as string,
      page: page ? parseInt(page as string, 10) : undefined,
      limit: limit ? parseInt(limit as string, 10) : undefined,
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'asc' | 'desc',
    })

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const getLeadById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params
    const lead = await leadService.getLeadById(id)

    if (!lead) {
      res.status(404).json({
        success: false,
        error: {
          message: `Lead con ID '${id}' no encontrado`,
        },
      })
      return
    }

    res.status(200).json({
      success: true,
      data: lead,
    })
  } catch (error) {
    next(error)
  }
}

export const createLead = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const createdLead = await leadService.createLead(req.body)

    res.status(201).json({
      success: true,
      message: 'Lead creado exitosamente',
      data: createdLead,
    })
  } catch (error) {
    next(error)
  }
}

export const updateLeadStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const updatedLead = await leadService.updateLeadStatus(id, status)

    if (!updatedLead) {
      res.status(404).json({
        success: false,
        error: {
          message: `Lead con ID '${id}' no fue encontrado para actualizar`,
        },
      })
      return
    }

    res.status(200).json({
      success: true,
      message: 'Estado del lead actualizado exitosamente',
      data: updatedLead,
    })
  } catch (error) {
    next(error)
  }
}
