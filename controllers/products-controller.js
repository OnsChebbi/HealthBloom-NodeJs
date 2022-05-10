const {validationResult} = require('express-validator');

const HttpError = require("../models/http-error");
const Product = require('../models/product');
const Review = require('../models/review');
const mongoose = require("mongoose");
const {log} = require("debug");

const stripe = require('stripe')('sk_test_51KqTxUBfP4XL5It4LoSuJhybl2OSCoZyvuVmUW5Iv5mgEeLbEqEYRHlKQrFrPPfGVb1Fyqn7EdPVMbxKP0ur2WSZ00DCaBWq5B');


const YOUR_DOMAIN = 'http://localhost:3000/shop'

const endpointSecret = 'whsec_46ded17522ba46705ede07c5c51e12536cc9053d3beccaacdb51a44df8fbccb6';

const getProductById = async (req, res, next) => {
    const productId = req.params.pid;
    let product;
    try {
        product = await Product.findById(productId).populate('reviews');
    } catch (e) {
        const error = new HttpError('could not find a product.', 500);
        return next(error);
    }
    if (!product) {
        return next(new HttpError('Could not find a product for the provided id.', 404));
    }
    res.json({product: product.toObject({getters: true})});
}

const getProducts = async (req, res, next) => {

    let products
    try {
        products = await Product.find();

    } catch (e) {
        return next(new HttpError('Fetching products failed. Please try again later.', 500));
    }
    if (!products || products.length === 0) {
        return next(new HttpError('Could not find products.', 404));
    }
    res.json({products: products.map(product => product.toObject({getters: true}))});
};


const createProduct = async (req, res, next) => {

    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
        console.log(errors.errors[0].msg);
        // const error = new HttpError('Invalid inputs passed, please check your data.', 422);
        const error = new HttpError(errors.errors[0].msg, 422);
        return next(error);
    }

    const {name, description, price, quantity, category} = req.body;
    const createdProduct = new Product({
        name,
        description,
        price,
        quantity: quantity,
        category,
        image: req.file.path,
        date: new Date(),
        reviews: []
    });

    try {
        await createdProduct.save();
    } catch (e) {

        const error = new HttpError('Creating product failed, please try again', 500);
        return next(error);
    }
    res.status(201).json({product: createdProduct});
};

const updateProductById = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        // throw new HttpError('Invalid inputs passed, please check your data.', 422);
        throw new HttpError(errors.errors[0].msg, 422);
    }

    const {name, description, price, quantity, category} = req.body;
    const productId = req.params.pid;

    let product;
    try {
        product = await Product.findById(productId);
    } catch (e) {
        const error = new HttpError('could not find a product.', 500);
        return next(error);
    }

    if (!product) {
        return next(new HttpError('Could not find a product for the provided id.', 404));
    }


    product.name = name;
    product.description = description;
    product.price = price;
    product.quantity = quantity;
    product.category = category;

    try {
        await product.save();

    } catch (e) {
        const error = new HttpError('could not update  product.', 500);
        return next(error);
    }

    res.status(200).json({product: product.toObject({getters: true})});

}

const deleteProductById = async (req, res, next) => {
    const productId = req.params.pid;

    let product;
    try {
        product = await Product.findById(productId);
    } catch (e) {
        const error = new HttpError('could not delete a product.', 500);
        return next(error);
    }


    try {
        // await product.remove();
        const sess = await mongoose.startSession();
        sess.startTransaction();
        Review.deleteMany({_id: {$in: product.reviews}}, err => console.log(err)).session(sess)
        await product.remove({session: sess});
        await sess.commitTransaction()
    } catch (e) {
        return next(new HttpError('Could not delete a product', 404));

    }

    res.status(200).json({message: 'Deleted  Product.'});

}

const checkoutCart = async (req, res, next) => {
    const sessionId = req.params.pid;
    let coupon;
    let session;
    if (req.body.discount && req.body.discount != 0) {
        coupon = await stripe.coupons.create({
            percent_off: req.body.discount,
            currency: 'usd'
        });
    }

    const line_items = req.body.items.map((item) => {


        return {
            name: item.name,
            description: item.name,
            images: ['https://www.ubuy.tn/productimg/?image=aHR0cHM6Ly9tLm1lZGlhLWFtYXpvbi5jb20vaW1hZ2VzL0kvODEyM3llbHZHa0wuX0FDX1NMMTUwMF8uanBn.jpg'],
            amount: item.price * 100,
            currency: 'usd',
            quantity: item.quantity
        };
    })
    if (coupon) {
        session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: 'payment',
            discounts: [{
                coupon: coupon.id
            }],
            success_url: `${YOUR_DOMAIN}/invoice?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${YOUR_DOMAIN}/checkout`,
        });
    } else {
        session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: 'payment',
            success_url: `${YOUR_DOMAIN}/invoice?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${YOUR_DOMAIN}/checkout`,
        });
    }


    res.json({url: session.url});
};

const paymentReciept = async (req, res, next) => {
    const sessionId = req.params.sessionId;

    let session;
    let items;
    try {
        session = await stripe.checkout.sessions.retrieve(sessionId);
        items = await stripe.checkout.sessions.listLineItems(sessionId);
    } catch (e) {
        console.log(e);
    }

    res.json({items: items.data, session});

};

const stripeWebhook = async (request, response, next) => {

    const sig = request.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
        console.log(err.message);
        response.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log(paymentIntent);
            console.log('PaymentIntent was successful!');
            break;
        case 'payment_method.attached':
            const paymentMethod = event.data.object;
            console.log(paymentMethod)
            console.log('PaymentMethod was attached to a Customer!');
            break;
        // ... handle other event types
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    response.json({received: true});
};


const getPayments = async (req, res, next) => {

    const email = req.params.email;
    let items;
    let payments
    try {

        items = await stripe.paymentIntents.list({limit: 10})
        payments = items.data.filter(pi => pi.status === "succeeded" && pi.charges.data[0].billing_details.email === email);

    } catch (e) {
        console.log(e);
    }


    res.json(payments);
};
const getSessionId = async (req, res, next) => {

    const piId = req.params.piId;

    let session;
    try {

        session = await stripe.checkout.sessions.list({
            payment_intent: piId,
        });
    } catch (e) {
        console.log(e);
    }

    res.json({sessionId: session.data[0].id});
};


module.exports = {
    getProductById,
    getProducts,
    createProduct,
    updateProductById,
    deleteProductById,
    checkoutCart,
    paymentReciept,
    stripeWebhook,
    getPayments,
    getSessionId
};