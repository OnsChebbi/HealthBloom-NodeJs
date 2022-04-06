const {validationResult} = require('express-validator');

const HttpError = require("../models/http-error");
const Product = require('../models/product');
const Review = require('../models/review');
const mongoose = require("mongoose");
const multiparty = require('multiparty');




const getProductById = async (req, res, next) => {
    const productId = req.params.pid;
    let product;
    try {
        product = await Product.findById(productId);
    }catch (e) {
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

    }catch (e) {
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
        reviews: []
    });

    try {
        await createdProduct.save();
    }catch (e) {

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
    }catch (e) {
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

    }catch (e) {
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
    }catch (e) {
        const error = new HttpError('could not delete a product.', 500);
        return next(error);
    }


    try {
        const sess = await  mongoose.startSession();
        sess.startTransaction();
        Review.deleteMany({_id: { $in: product.reviews}},err => console.log(err) ).session(sess)
        await  product.remove({session: sess});
        await sess.commitTransaction()
    }catch (e) {
        return next(new HttpError('Could not delete a product', 404));

    }

    res.status(200).json({message: 'Deleted  Product.'});

}

module.exports = {
    getProductById,
    getProducts,
    createProduct,
    updateProductById,
    deleteProductById
};