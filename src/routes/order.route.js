/**
 * @license Apache-2.0
 * @copyright Fancy 2024
 */

'use strict';


const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');

router.get('/', orderController.getOrders);
router.get('/:orderId', orderController.getOrderDetail);
router.put('/endofday', orderController.endOfDay);

module.exports = router;