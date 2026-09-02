import supertest from 'supertest'
import { createApp } from '../app'
import { leadService } from '../services/lead.service'

const app = createApp()
const request = supertest(app)

describe('Lead Endpoints (/api/leads)', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('GET /api/leads', () => {
    it('debe retornar lista de leads paginados', async () => {
      const mockResult = {
        data: [
          {
            _id: '507f1f77bcf86cd799439011',
            name: 'Carlos Mendoza',
            email: 'carlos@example.com',
            phone: '7000-1001',
            source: 'Facebook',
            status: 'Nuevo',
            budget: 145000,
            project: 'Residencial Altavista',
            createdAt: '2026-08-01T00:00:00.000Z',
            updatedAt: '2026-08-01T00:00:00.000Z',
          },
        ] as any,
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      }

      jest.spyOn(leadService, 'getLeads').mockResolvedValue(mockResult)

      const res = await request.get('/api/leads?status=Nuevo')

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data).toHaveLength(1)
      expect(res.body.pagination.total).toBe(1)
    })

    it('debe filtrar leads por el parámetro search (nombre o correo)', async () => {
      const mockResult = {
        data: [
          {
            _id: '507f1f77bcf86cd799439011',
            name: 'Carlos Mendoza',
            email: 'carlos@example.com',
            phone: '7000-1001',
            source: 'Facebook',
            status: 'Nuevo',
            budget: 145000,
            project: 'Residencial Altavista',
            createdAt: '2026-08-01T00:00:00.000Z',
            updatedAt: '2026-08-01T00:00:00.000Z',
          },
        ] as any,
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      }

      const getLeadsSpy = jest.spyOn(leadService, 'getLeads').mockResolvedValue(mockResult)

      const res = await request.get('/api/leads?search=Carlos')

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(getLeadsSpy).toHaveBeenCalledWith(
        expect.objectContaining({ search: 'Carlos' })
      )
    })
  })

  describe('GET /api/leads/:id', () => {
    it('debe retornar 400 si el ID de MongoDB no es válido', async () => {
      const res = await request.get('/api/leads/invalid-id-123')

      expect(res.status).toBe(400)
      expect(res.body.success).toBe(false)
      expect(res.body.error.message).toContain(
        'no es un identificador de MongoDB válido',
      )
    })

    it('debe retornar 404 si el lead no existe', async () => {
      const validId = '507f1f77bcf86cd799439011'
      jest.spyOn(leadService, 'getLeadById').mockResolvedValue(null)

      const res = await request.get(`/api/leads/${validId}`)

      expect(res.status).toBe(404)
      expect(res.body.success).toBe(false)
    })
  })

  describe('POST /api/leads', () => {
    it('debe retornar 400 si faltan campos obligatorios o el email es inválido', async () => {
      const invalidData = {
        name: '',
        email: 'correo-invalido',
        budget: -500,
      }

      const res = await request.post('/api/leads').send(invalidData)

      expect(res.status).toBe(400)
      expect(res.body.success).toBe(false)
      expect(res.body.error.details).toBeDefined()
    })

    it('debe crear un lead exitosamente con datos válidos', async () => {
      const validData = {
        name: 'Juan Pérez',
        email: 'juan@example.com',
        phone: '7000-9999',
        source: 'Website',
        status: 'Nuevo',
        budget: 200000,
        project: 'Vista Verde',
      }

      const createdLead = {
        ...validData,
        _id: '507f1f77bcf86cd799439022',
      } as any
      jest.spyOn(leadService, 'createLead').mockResolvedValue(createdLead)

      const res = await request.post('/api/leads').send(validData)

      expect(res.status).toBe(201)
      expect(res.body.success).toBe(true)
      expect(res.body.data.name).toBe('Juan Pérez')
    })
  })

  describe('PATCH /api/leads/:id/status', () => {
    it('debe rechazar un estado no permitido con código 400', async () => {
      const validId = '507f1f77bcf86cd799439011'
      const res = await request
        .patch(`/api/leads/${validId}/status`)
        .send({ status: 'EstadoInexistente' })

      expect(res.status).toBe(400)
      expect(res.body.success).toBe(false)
    })

    it('debe actualizar el estado del lead con un estado válido', async () => {
      const validId = '507f1f77bcf86cd799439011'
      const updatedLead = {
        _id: validId,
        name: 'Carlos Mendoza',
        status: 'Contactado',
      } as any

      jest
        .spyOn(leadService, 'updateLeadStatus')
        .mockResolvedValue(updatedLead)

      const res = await request
        .patch(`/api/leads/${validId}/status`)
        .send({ status: 'Contactado' })

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data.status).toBe('Contactado')
    })
  })
})
