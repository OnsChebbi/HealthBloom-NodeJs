const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const couponSchema = new Schema({
    name: {type: String, required: true},
    percentage: {type: Number, required: true},
});

couponSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Coupon', couponSchema);