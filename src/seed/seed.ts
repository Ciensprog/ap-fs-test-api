import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { Lead } from '../models/lead.model'

dotenv.config()

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/alto_porte_db'

export const initialLeads = [
  {
    name: 'Carlos Mendoza',
    email: 'carlos@example.com',
    phone: '7000-1001',
    source: 'Facebook',
    status: 'Nuevo',
    budget: 145000,
    project: 'Residencial Altavista',
    createdAt: new Date('2026-08-01T00:00:00.000Z'),
  },
  {
    name: 'María López',
    email: 'maria@example.com',
    phone: '7000-1002',
    source: 'Instagram',
    status: 'Contactado',
    budget: 175000,
    project: 'Residencial Altavista',
    createdAt: new Date('2026-08-03T00:00:00.000Z'),
  },
  {
    name: 'José Hernández',
    email: 'jose@example.com',
    phone: '7000-1003',
    source: 'Website',
    status: 'Calificado',
    budget: 210000,
    project: 'Torres del Valle',
    createdAt: new Date('2026-08-05T00:00:00.000Z'),
  },
  {
    name: 'Andrea Martínez',
    email: 'andrea@example.com',
    phone: '7000-1004',
    source: 'Facebook',
    status: 'Reservado',
    budget: 185000,
    project: 'Torres del Valle',
    createdAt: new Date('2026-08-07T00:00:00.000Z'),
  },
  {
    name: 'Luis Ramírez',
    email: 'luis@example.com',
    phone: '7000-1005',
    source: 'Referido',
    status: 'Nuevo',
    budget: 130000,
    project: 'Residencial Altavista',
    createdAt: new Date('2026-08-10T00:00:00.000Z'),
  },
  {
    name: 'Sofía Castillo',
    email: 'sofia@example.com',
    phone: '7000-1006',
    source: 'Instagram',
    status: 'Descartado',
    budget: 115000,
    project: 'Vista Verde',
    createdAt: new Date('2026-08-12T00:00:00.000Z'),
  },
  {
    name: 'Roberto Flores',
    email: 'roberto@example.com',
    phone: '7000-1007',
    source: 'Website',
    status: 'Calificado',
    budget: 195000,
    project: 'Vista Verde',
    createdAt: new Date('2026-08-15T00:00:00.000Z'),
  },
  {
    name: 'Daniela Cruz',
    email: 'daniela@example.com',
    phone: '7000-1008',
    source: 'Facebook',
    status: 'Reservado',
    budget: 220000,
    project: 'Torres del Valle',
    createdAt: new Date('2026-08-18T00:00:00.000Z'),
  },
  {
    name: 'Fernando Reyes',
    email: 'fernando@example.com',
    phone: '7000-1009',
    source: 'Referido',
    status: 'Contactado',
    budget: 160000,
    project: 'Residencial Altavista',
    createdAt: new Date('2026-08-20T00:00:00.000Z'),
  },
  {
    name: 'Gabriela Pérez',
    email: 'gabriela@example.com',
    phone: '7000-1010',
    source: 'Instagram',
    status: 'Calificado',
    budget: 205000,
    project: 'Vista Verde',
    createdAt: new Date('2026-08-22T00:00:00.000Z'),
  },
]

export const seedData = async () => {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log(`[Seed] Conectado a MongoDB: ${MONGODB_URI}`)

    await Lead.deleteMany({})
    console.log('[Seed] Colección "leads" limpiada exitosamente')

    const inserted = await Lead.insertMany(initialLeads)
    console.log(`[Seed] ${inserted.length} leads insertados correctamente`)

    await mongoose.disconnect()
    console.log('[Seed] Desconectado de MongoDB')
  } catch (error) {
    console.error('[Seed] Error al ejecutar el script de seed:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  seedData()
}
