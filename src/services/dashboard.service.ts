import { Lead } from '../models/lead.model'

export interface GroupMetric {
  label: string
  count: number
}

export interface DashboardSummaryResponse {
  totalLeads: number
  averageBudget: number
  reservedLeads: number
  conversionRate: number
  byStatus: GroupMetric[]
  bySource: GroupMetric[]
  byProject: GroupMetric[]
}

export class DashboardService {
  async getDashboardSummary(): Promise<DashboardSummaryResponse> {
    const pipelineResults = await Lead.aggregate([
      {
        $facet: {
          metrics: [
            {
              $group: {
                _id: null,
                totalLeads: { $sum: 1 },
                averageBudget: { $avg: '$budget' },
                reservedLeads: {
                  $sum: {
                    $cond: [{ $eq: ['$status', 'Reservado'] }, 1, 0],
                  },
                },
              },
            },
          ],
          byStatus: [
            { $group: { _id: '$status', count: { $sum: 1 } } },
            { $project: { _id: 0, label: '$_id', count: 1 } },
          ],
          bySource: [
            { $group: { _id: '$source', count: { $sum: 1 } } },
            { $project: { _id: 0, label: '$_id', count: 1 } },
          ],
          byProject: [
            { $group: { _id: '$project', count: { $sum: 1 } } },
            { $project: { _id: 0, label: '$_id', count: 1 } },
          ],
        },
      },
    ])

    const facet = pipelineResults[0] || {}
    const metricDoc =
      facet.metrics && facet.metrics.length > 0 ? facet.metrics[0] : null

    const totalLeads = metricDoc ? metricDoc.totalLeads : 0
    const averageBudget = metricDoc
      ? Math.round(metricDoc.averageBudget || 0)
      : 0
    const reservedLeads = metricDoc ? metricDoc.reservedLeads : 0
    const rawConversion =
      totalLeads > 0 ? (reservedLeads / totalLeads) * 100 : 0
    const conversionRate = Number.isInteger(rawConversion)
      ? rawConversion
      : Number(rawConversion.toFixed(2))

    const byStatus: GroupMetric[] = facet.byStatus || []
    const bySource: GroupMetric[] = facet.bySource || []
    const byProject: GroupMetric[] = facet.byProject || []

    return {
      totalLeads,
      averageBudget,
      reservedLeads,
      conversionRate,
      byStatus,
      bySource,
      byProject,
    }
  }
}

export const dashboardService = new DashboardService()
