const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    image: {type: String, required: true},
    price: {type: Number, required: true},
    quantity: {type: String, required: true},
    category: {type: String, required: true},
    reviews: [{type: mongoose.Types.ObjectId, required: true, ref: 'Review'}]

});

productSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Product', productSchema);