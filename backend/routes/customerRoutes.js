const express = require('express');
const productController = require('../controllers/productController');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.get('/products', productController.getProducts);
router.post('/add-order', orderController.createOrEditOrder);
router.post('/order-history', orderController.getSoldProductsByUser);
router.post('/order-cart/', orderController.getUnsoldProductsByUser);
router.post('/buy-cart', orderController.buyCart);
router.get('/purchase-history', orderController.getPurchaseHistory);

module.exports = router;
