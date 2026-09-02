import { Schema, model, Document } from 'mongoose'

export const ALLOWED_STATUSES = [
  'Nuevo',
  'Contactado',
  'Calificado',
  'Reservado',
  'Descartado',
] as const

export type LeadStatus = (typeof ALLOWED_STATUSES)[number]

export interface ILead extends Document {
  name: string
  email: string
  phone?: string
  source: string
  status: LeadStatus
  budget: number
  project: string
  createdAt: Date
  updatedAt: Date
}

const leadSchema = new Schema<ILead>(
  {
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'El correo electrónico es obligatorio'],
      trim: true,
      lowercase: true,
      match: [
        /^\S+@\S+\.\S+$/,
        'El correo electrónico debe tener un formato válido',
      ],
    },
    phone: {
      type: String,
      trim: true,
    },
    source: {
      type: String,
      required: [true, 'La fuente u origen es obligatoria'],
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ALLOWED_STATUSES,
        message:
          'Estado no permitido. Debe ser: Nuevo, Contactado, Calificado, Reservado o Descartado',
      },
      default: 'Nuevo',
      required: [true, 'El estado comercial es obligatorio'],
    },
    budget: {
      type: Number,
      required: [true, 'El presupuesto es obligatorio'],
      min: [0.01, 'El presupuesto debe ser mayor que cero'],
    },
    project: {
      type: String,
      required: [true, 'El proyecto inmobiliario es obligatorio'],
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, { __v, ...rest }) => ({
        ...rest,
      }),
    },
  },
)

// Performance compound & single indexes
leadSchema.index({ status: 1, createdAt: -1 })
leadSchema.index({ source: 1, createdAt: -1 })
leadSchema.index({ project: 1, createdAt: -1 })
leadSchema.index({ budget: -1 })
leadSchema.index({ name: 'text', email: 'text' })

export const Lead = model<ILead>('Lead', leadSchema)
