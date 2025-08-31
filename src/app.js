const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const pino = require('pino')
const pinoHttp = require('pino-http')

const todosRouter = require('./routes/todos')

const app = express()

// Basic hardening & JSON parsing
app.use(helmet())
app.use(cors())
app.use(express.json())

// Structured logging
const logger = pino({ level: process.env.LOG_LEVEL || 'info' })
app.use(pinoHttp({ logger }))

// Health endpoints
app.get('/healthz', (_req, res) => res.status(200).json({ status: 'ok' }))
app.get('/readyz', (_req, res) => res.status(200).json({ ready: true }))

// Simple API routes
app.use('/api/todos', todosRouter)

// Root
app.get('/', (req, res) => {
  res.json({
    app: process.env.APP_NAME || 'monolith-node-k8s',
    version: process.env.APP_VERSION || '1.0.0',
    message: 'Hello from Express on Kubernetes!'
  })
})

module.exports = app
