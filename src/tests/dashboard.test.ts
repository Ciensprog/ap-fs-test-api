import supertest from 'supertest'
import { createApp } from '../app'
import { dashboardService } from '../services/dashboard.service'

const app = createApp()
const request = supertest(app)

describe('GET /api/dashboard/summary', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('debe retornar los indicadores y agregaciones esperados del dashboard', async () => {
    const mockSummary = {
      totalLeads: 10,
      averageBudget: 174000,
      reservedLeads: 2,
      conversionRate: 20,
      byStatus: [
        { label: 'Nuevo', count: 2 },
        { label: 'Contactado', count: 2 },
        { label: 'Calificado', count: 3 },
        { label: 'Reservado', count: 2 },
        { label: 'Descartado', count: 1 },
      ],
      bySource: [
        { label: 'Facebook', count: 3 },
        { label: 'Instagram', count: 3 },
        { label: 'Website', count: 2 },
        { label: 'Referido', count: 2 },
      ],
      byProject: [
        { label: 'Residencial Altavista', count: 4 },
        { label: 'Torres del Valle', count: 3 },
        { label: 'Vista Verde', count: 3 },
      ],
    }

    jest
      .spyOn(dashboardService, 'getDashboardSummary')
      .mockResolvedValue(mockSummary)

    const res = await request.get('/api/dashboard/summary')

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data.totalLeads).toBe(10)
    expect(res.body.data.averageBudget).toBe(174000)
    expect(res.body.data.reservedLeads).toBe(2)
    expect(res.body.data.conversionRate).toBe(20)
    expect(res.body.data.byStatus).toHaveLength(5)
    expect(res.body.data.bySource).toHaveLength(4)
    expect(res.body.data.byProject).toHaveLength(3)
  })
})
