const mongoose = require('mongoose');
const {validationResult} = require('express-validator');

const HttpError = require("../models/http-error");
const Review = require('../models/review');
const Product = require('../models/product');



const getReviewById = async (req, res, next) => {
    const reviewId = req.params.rid;
    let review;
    try {
        review = await Review.findById(reviewId);
    }catch (e) {
        const error = new HttpError('could not find a review.', 500);
        return next(error);
    }
    if (!review) {
        return next(new HttpError('Could not find a review for the provided id.', 404));
    }
    res.json({review: review.toObject({getters: true})});
}

// const getReviewsByUserId = async (req, res, next) => {
//     const userId = req.params.uid;
//     let reviews
//     try {
//         reviews = await Review.find({user: userId});
//
//     }catch (e) {
//         return next(new HttpError('Fetching reviews failed. Please try again later.', 500));
//     }
//     if (!reviews || reviews.length === 0) {
//         return next(new HttpError('Could not find reviews for the provided user id.', 404));
//     }
//     res.json({reviews: reviews.map(review => review.toObject({getters: true}))});
// };

const getReviewsByProductId = async (req, res, next) => {
    const productId = req.params.pid;
    let reviews
    try {
        reviews = await Review.find({product: productId});

    }catch (e) {
        return next(new HttpError('Fetching reviews failed. Please try again later.', 500));
    }
    if (!reviews || reviews.length === 0) {
        return next(new HttpError('Could not find reviews for the provided product id.', 404));
    }
    res.json({reviews: reviews.map(review => review.toObject({getters: true}))});
};

const getReviews = async (req, res, next) => {

    let reviews
    try {
        reviews = await Review.find();

    }catch (e) {
        return next(new HttpError('Fetching reviews failed. Please try again later.', 500));
    }
    if (!reviews || reviews.length === 0) {
        return next(new HttpError('Could not find reviews.', 404));
    }
    res.json({reviews: reviews.map(review => review.toObject({getters: true}))});
};


const createReview = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        const error = new HttpError(errors.errors[0].msg, 422);
        return next(error);
    }

    const {name, message, rating, date, email, product} = req.body;
    const createdReview = new Review({
        name,
        message,
        rating,
        date,
        email,
        product,
    });

    let existingProduct;
    try {
        existingProduct = await Product.findById(product);
    } catch (e) {
        const error = new HttpError('Creating product failed, please try again', 500);
        return next(error);
    }

    if (!existingProduct) {
        const error = new HttpError('Could not find product for the provided id', 404);
        return next(error);
    }

    console.log(existingProduct);

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdReview.save({session: sess});
        existingProduct.reviews.push(createdReview);
        await existingProduct.save({session: sess});
        await sess.commitTransaction();
    } catch (e) {
        console.log(e)
        const error = new HttpError('Creating review failed, please try again', 500);
        return next(error);
    }

    res.status(201).json({review: createdReview});
};

const updateReviewById = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        throw new HttpError(errors.errors[0].msg, 422);
    }

    const  {name, message, rating, date, email} = req.body;
    const reviewId = req.params.rid;

    let review;
    try {
        review = await Review.findById(reviewId);
    }catch (e) {
        const error = new HttpError('could not find a review.', 500);
        return next(error);
    }

    if (!review) {
        return next(new HttpError('Could not find a review for the provided id.', 404));
    }




    review.name = name;
    review.message = message;
    review.price = rating;
    review.date = date;
    review.email = email;



    try {
        await review.save();

    }catch (e) {
        const error = new HttpError('could not update  review.', 500);
        return next(error);
    }

    res.status(200).json({review: review.toObject({getters: true})});

}

const deleteReviewById = async (req, res, next) => {
    const reviewId = req.params.pid;

    let review;
    try {
        review = await Review.findById(reviewId).populate('product');
    }catch (e) {
        const error = new HttpError('could not delete a review.', 500);
        return next(error);
    }

    try {
        const sess = await  mongoose.startSession();
        sess.startTransaction();
        await review.remove({session: sess});
        review.product.reviews.pull(review);
        await review.product.save({session: sess});
        await sess.commitTransaction()
    }catch (e) {
        return next(new HttpError('Could not delete a review', 404));

    }

    res.status(200).json({message: 'Deleted  Review.'});

}

module.exports = {
    getReviewById,
    getReviewsByProductId,
    getReviews,
    createReview,
    updateReviewById,
    deleteReviewById
};