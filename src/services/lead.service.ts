import { Lead, ILead, LeadStatus } from '../models/lead.model'

export interface LeadFilterOptions {
  search?: string
  status?: string
  source?: string
  project?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedLeadsResponse {
  data: ILead[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export class LeadService {
  async getLeads(
    options: LeadFilterOptions,
  ): Promise<PaginatedLeadsResponse> {
    const {
      search,
      status,
      source,
      project,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = options

    const query: Record<string, any> = {}

    if (search && search.trim().length > 0) {
      const searchRegex = new RegExp(search.trim(), 'i')
      query.$or = [
        { name: { $regex: searchRegex } },
        { email: { $regex: searchRegex } },
      ]
    }

    if (status) query.status = status
    if (source) query.source = source
    if (project) query.project = project

    const validSortFields = ['createdAt', 'budget']
    const sortField = validSortFields.includes(sortBy)
      ? sortBy
      : 'createdAt'
    const sortDirection = sortOrder === 'asc' ? 1 : -1

    const skip = (Math.max(1, page) - 1) * Math.max(1, limit)
    const parsedLimit = Math.max(1, Math.min(100, limit))

    const [data, total] = await Promise.all([
      Lead.find(query)
        .sort({ [sortField]: sortDirection })
        .skip(skip)
        .limit(parsedLimit)
        .exec(),
      Lead.countDocuments(query),
    ])

    const totalPages = Math.ceil(total / parsedLimit) || 1

    return {
      data,
      total,
      page: Math.max(1, page),
      limit: parsedLimit,
      totalPages,
    }
  }

  async getLeadById(id: string): Promise<ILead | null> {
    return Lead.findById(id).exec()
  }

  async createLead(leadData: Partial<ILead>): Promise<ILead> {
    const newLead = new Lead(leadData)
    return newLead.save()
  }

  async updateLeadStatus(
    id: string,
    status: LeadStatus,
  ): Promise<ILead | null> {
    return Lead.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true },
    ).exec()
  }
}

export const leadService = new LeadService()
