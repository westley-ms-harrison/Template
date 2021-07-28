const connection = require('./connection')

const { formatOrder, formatOrderList } = require('../formatter')

module.exports = {
  listOrders,
  addOrder,
  editOrder
}

function listOrders (db = connection) {
  return db('orders_products')
    .join('orders', 'orders_products.order_id', 'orders.id')
    .join('products', 'orders_products.product_id', 'products.id')
    .select('products.id as productId', 'orders.id as orderId', 'quantity',
      'created_at as createdAt', 'status', 'name')
    .then(formatOrderList)
}

function addOrder (order, db = connection) {
  const timestamp = new Date(Date.now())
  return db('orders').insert({
    created_at: timestamp,
    status: 'pending'
  })
    .then(([id]) => addOrderLines(id, order, db))
}

function editOrder (id, orderChanges, db = connection) {
  return orderExists(id, db)
    .then(() => {
      return db('orders')
        .update(orderChanges)
        .where('id', id)
    })
    .then(() => findOrderById(id, db))
}

function addOrderLines (id, order, db = connection) {
  const orderLines = order.map(item => {
    return {
      order_id: id,
      product_id: item.id,
      quantity: item.quantity
    }
  })
  return db('orders_products').insert(orderLines)
}

function orderExists (id, db = connection) {
  return db('orders')
    .where('id', id)
    .first()
    .then(order => {
      if (!order) throw new Error('Order not found')
    })
}

function findOrderById (id, db = connection) {
  return db('orders_products')
    .join('orders', 'orders_products.order_id', 'orders.id')
    .join('products', 'orders_products.product_id', 'products.id')
    .select('products.id as productId', 'orders.id as orderId', 'quantity',
      'created_at as createdAt', 'status', 'name')
    .where('orders.id', id)
    .then(formatOrder)
}