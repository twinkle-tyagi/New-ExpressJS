const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId',shopController.getProduct);  // : tells expressJS to accept any route after : , eg: /products/12
// if we have any specific route, like /products/delete, the we have to put route having : at the end, as expressJS will encounter this and handle it and control will not reach /delete route. 
router.get('/cart', shopController.getCart);

router.post('/cart', shopController.postCart);

router.get('/orders', shopController.getOrders);

router.get('/checkout', shopController.getCheckout);

module.exports = router;
