import dotenv from 'dotenv'
import { createApp } from './app'
import { connectDatabase } from './config/database'

dotenv.config()

const PORT = process.env.PORT || 3000

const startServer = async () => {
  await connectDatabase()

  const app = createApp()

  app.listen(PORT, () => {
    console.log(
      `🚀 [Server] Alto Porte API is running on http://localhost:${PORT}`,
    )
    console.log(
      `📌 Health check available at http://localhost:${PORT}/api/health`,
    )
  })
}

startServer()
