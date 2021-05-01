const mongoose = require('mongoose');
const { Order } = require('../models/order');
const { OrderItem } = require('../models/order-item');
exports.addOrderController = async (req, res, next) => {
    const orderItemsIds = Promise.all(req.body.orderItems.map(async orderitem => {
        let newOrderItem = OrderItem({
            quantity: orderitem.quantity,
            product: orderitem.product,
        });
        newOrderItem = await newOrderItem.save();
        return newOrderItem._id;
    }));
    const orderItemIdsResolved = await orderItemsIds;

    const totalPrices = await Promise.all(orderItemIdsResolved.map(async (orderItemId) => {
        const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price');
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice;
    }));
    const totalPrice = totalPrices.reduce((a, b) => a + b, 0);
    let order = new Order({
        orderItems: orderItemIdsResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: totalPrice,
        user: req.body.user,
    })
    order = await order.save();

    if (!order)
        return res.status(400).send('the order cannot be created!')

    res.send(order);
};
exports.getOrderController = async (req, res, next) => {
    const orderList = await Order.find().populate('user', 'name').sort({ 'dateOrdered': -1 });
    if (!orderList) {
        res.status(500).json({
            success: false,
        })
    }
    res.status(200).json(orderList);
};
exports.getSingleOrderController = async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name').populate({ path: 'orderItems', populate: { path: 'product', populate: 'category' } });
    if (!order) {
        res.status(500).json({
            success: false,
        })
    }
    res.status(200).json(order);
};
exports.getOrderTotalSalesController = async (req, res, next) => {
    const totalsales = await Order.aggregate([
        {
            $group: { _id: null, totalsales: { $sum: '$totalPrice' } }
        }
    ])
    if (!totalsales)
        return res.status(400).send('the order sales cannot be generated');

    res.send({ totalsales: totalsales.pop().totalsales });
};
exports.updateOrder = async (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        res.status(400).send('Invalid Order Id');
    }
    const order = await Order.findByIdAndUpdate(req.params.id, {
        status: req.body.status,
    }, {
        new: true,
    });
    if (!order) {
        res.status(400).json({
            message: 'The Order cannot be created!',
        })
    }
    res.send(order);
};
exports.deleteOrderController = async (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        res.status(400).send('Invalid Order Id');
    }
    Order.findByIdAndRemove(req.params.id).then(async order => {
        if (order) {
            await order.orderItems.map(async orderItem => {
                await OrderItem.findByIdAndRemove(orderItem);
            });
            return res.status(200).json({ success: true, message: 'the order is deleted' });
        } else {
            return res.status(404).json({ success: false, message: 'the order no Found' });
        }
    }).catch(err => {
        return res.status(500).json({ success: false, error: err });

    });

};