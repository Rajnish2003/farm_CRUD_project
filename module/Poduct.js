const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        min: 0
    },
    category: {
        type: String,
        enum: ['fruit', 'vegetable', 'dairy', 'poultry', 'other']
    },
    farm: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'farm'
    }
})
const Product = mongoose.model('Product', productSchema);
module.exports = Product;