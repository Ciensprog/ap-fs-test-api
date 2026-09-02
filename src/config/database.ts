import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/alto_porte_db'

export const connectDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log(
      `[Database] MongoDB connected successfully to ${MONGODB_URI}`,
    )
  } catch (error) {
    console.error('[Database] Connection error:', error)
    process.exit(1)
  }
}

export const disconnectDatabase = async () => {
  try {
    await mongoose.disconnect()
    console.log('[Database] MongoDB disconnected successfully')
  } catch (error) {
    console.error('[Database] Disconnection error:', error)
  }
}

export const isDatabaseConnected = (): boolean => {
  return mongoose.connection.readyState === 1
}
