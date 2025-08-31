const express = require('express')
const router = express.Router()

// In-memory store (monolith-style!)
let idCounter = 1
const TODOS = [
  { id: idCounter++, title: 'Ship first container', done: true },
  { id: idCounter++, title: 'Wire liveness probe', done: false }
]

router.get('/', (req, res) => {
  res.json({ items: TODOS })
})

router.post('/', (req, res) => {
  const { title } = req.body
  if (!title) return res.status(400).json({ error: 'title is required' })
  const todo = { id: idCounter++, title, done: false }
  TODOS.push(todo)
  res.status(201).json(todo)
})

router.put('/:id', (req, res) => {
  const id = Number(req.params.id)
  const idx = TODOS.findIndex(t => t.id === id)
  if (idx === -1) return res.status(404).json({ error: 'not found' })

  const { title, done } = req.body
  if (typeof title !== 'undefined') TODOS[idx].title = title
  if (typeof done !== 'undefined') TODOS[idx].done = !!done
  res.json(TODOS[idx])
})

router.delete('/:id', (req, res) => {
  const id = Number(req.params.id)
  const idx = TODOS.findIndex(t => t.id === id)
  if (idx === -1) return res.status(404).json({ error: 'not found' })
  const [removed] = TODOS.splice(idx, 1)
  res.json(removed)
})

module.exports = router
