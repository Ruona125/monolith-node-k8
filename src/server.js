require('dotenv').config()
const http = require('http')
const app = require('./app')

const PORT = process.env.PORT || 3000

const server = http.createServer(app)

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})

// Graceful shutdown for Kubernetes
const shutdown = () => {
  console.log('Received termination signal, closing server...')
  server.close(() => {
    console.log('HTTP server closed.')
    process.exit(0)
  })

  // Force-exit safety timer
  setTimeout(() => {
    console.error('Forcing shutdown after 10s')
    process.exit(1)
  }, 10_000).unref()
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)
