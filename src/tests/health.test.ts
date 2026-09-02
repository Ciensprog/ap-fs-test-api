import supertest from 'supertest'
import { createApp } from '../app'
import * as db from '../config/database'

const app = createApp()
const request = supertest(app)

describe('GET /api/health', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('debe retornar status UP y 200 cuando la base de datos está conectada', async () => {
    jest.spyOn(db, 'isDatabaseConnected').mockReturnValue(true)

    const res = await request.get('/api/health')

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('status', 'UP')
    expect(res.body).toHaveProperty('database', 'CONNECTED')
    expect(res.body).toHaveProperty('timestamp')
  })

  it('debe retornar status DOWN y 503 cuando la base de datos está desconectada', async () => {
    jest.spyOn(db, 'isDatabaseConnected').mockReturnValue(false)

    const res = await request.get('/api/health')

    expect(res.status).toBe(503)
    expect(res.body).toHaveProperty('status', 'DOWN')
    expect(res.body).toHaveProperty('database', 'DISCONNECTED')
  })
})
