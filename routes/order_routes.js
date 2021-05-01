const express = require("express");
const router = express.Router();
const { getOrderTotalSalesController, deleteOrderController, addOrderController, getOrderController, getSingleOrderController, updateOrder } = require('../controller/order_controller');

router.post('/', addOrderController),

    router.get('/', getOrderController),
    router.get('/:id', getSingleOrderController),
    router.put('/:id', updateOrder),
    router.get('/get/totalsales', getOrderTotalSalesController),

    router.delete('/:id', deleteOrderController),



    module.exports = router;
