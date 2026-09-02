import express, { Application } from 'express'
import cors from 'cors'
import routes from './routes'
import {
  errorHandler,
  notFoundHandler,
} from './middlewares/error.middleware'

export const createApp = (): Application => {
  const app: Application = express()

  // Core Middlewares
  app.use(cors())
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  // API Routes
  app.use('/api', routes)

  // 404 & Error Handlers
  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
