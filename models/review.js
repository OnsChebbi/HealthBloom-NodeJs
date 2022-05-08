const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    title: {type: String, required: true},
    message: {type: String, required: true},
    rating:{type: Number, required: true},
    user: {type: String, required: true},
    product: {type: mongoose.Types.ObjectId, required: true, ref: 'Product'}

});

module.exports = mongoose.model('Review', reviewSchema);