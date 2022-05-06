const {validationResult} = require("express-validator");
const HttpError = require("../models/http-error");
const Coupon = require("../models/coupon");
const Product = require("../models/product");
const mongoose = require("mongoose");
const Review = require("../models/review");






const getCouponById = async (req, res, next) => {
    const couponId = req.params.cid;
    let coupon;
    try {
        coupon = await Coupon.findById(couponId);
    } catch (e) {
        const error = new HttpError('could not find a coupon.', 500);
        return next(error);
    }
    if (!coupon) {
        return next(new HttpError('Could not find a coupon for the provided id.', 404));
    }
    res.json({coupon: coupon.toObject({getters: true})});
}
const getCouponByName = async (req, res, next) => {
    const couponName = req.params.name;
    let coupon;
    try {
        coupon = await Coupon.findOne({name: couponName});
    } catch (e) {
        // const error = new HttpError('could not find a coupon.', 500);
        // return next(error);
        res.json({});
    }
    if (!coupon) {
        // return next(new HttpError('Could not find a coupon for the provided id.', 404));
        res.json({});

    }else {
        res.json({coupon: coupon.toObject({getters: true})});

    }
}

const getCoupons = async (req, res, next) => {

    let coupons;
    try {
        coupons = await Coupon.find();

    } catch (e) {
        return next(new HttpError('Fetching coupons failed. Please try again later.', 500));
    }
    if (!coupons || coupons.length === 0) {
        return next(new HttpError('Could not find coupons.', 404));
    }
    res.json({coupons: coupons.map(coupon => coupon.toObject({getters: true}))});
};




const createCoupon = async (req, res, next) => {

    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
        console.log(errors.errors[0].msg);
        // const error = new HttpError('Invalid inputs passed, please check your data.', 422);
        const error = new HttpError(errors.errors[0].msg, 422);
        return next(error);
    }

    const {name, percentage} = req.body;
    const createdCoupon = new Coupon({
        name,
        percentage
    });

    try {
        await createdCoupon.save();
    } catch (e) {

        const error = new HttpError('Creating coupon failed, please try again', 500);
        return next(error);
    }
    res.status(201).json({coupon: createdCoupon});
};

const updateCouponById = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        // throw new HttpError('Invalid inputs passed, please check your data.', 422);
        throw new HttpError(errors.errors[0].msg, 422);
    }

    const {name, percentage} = req.body;
    const couponId = req.params.cid;

    let coupon;
    try {
        coupon = await Coupon.findById(couponId);
    } catch (e) {
        const error = new HttpError('could not find a coupon.', 500);
        return next(error);
    }

    if (!coupon) {
        return next(new HttpError('Could not find a coupon for the provided id.', 404));
    }


    coupon.name = name;
    coupon.percentage = percentage;


    try {
        await coupon.save();

    } catch (e) {
        const error = new HttpError('could not update  coupon.', 500);
        return next(error);
    }

    res.status(200).json({coupon: coupon.toObject({getters: true})});

}

const deleteCouponById = async (req, res, next) => {
    const couponId = req.params.cid;

    let coupon;
    try {
        coupon = await Coupon.findById(couponId);
    } catch (e) {
        const error = new HttpError('could not delete a coupon.', 500);
        return next(error);
    }


    try {
        // await product.remove();
        await coupon.remove();

    } catch (e) {
        return next(new HttpError('Could not delete a coupon', 404));

    }

    res.status(200).json({message: 'Deleted  Coupon.'});

}



module.exports = {
    createCoupon,
    getCoupons,
    getCouponById,
    updateCouponById,
    deleteCouponById,
    getCouponByName
};