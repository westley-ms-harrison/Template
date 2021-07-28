const express = require('express')

const router = express.Router()

const db = require('../db/orders')

module.exports = router

router.get('/', (req, res) => {
  db.listOrders()
    .then(orders => {
      res.json(orders)
    })
    .catch(err => {
      res.status(500).send('DATABASE ERROR: ' + err.message)
    })
})

router.post('/', (req, res) => {
  const order = req.body
  db.addOrder(order)
    .then(() => {
      res.sendStatus(201)
    })
    .catch(err => {
      res.status(500).send('DATABASE ERROR: ' + err.message)
    })
})

router.patch('/:id', (req, res) => {
  const id = Number(req.params.id)
  const { status } = req.body
  const orderChanges = { status }
  db.editOrder(id, orderChanges)
    .then(order => {
      res.json(order)
    })
    .catch(err => {
      res.status(500).send('DATABASE ERROR: ' + err.message)
    })
})