const mongoose = require('mongoose');
const { Schema } = mongoose;

const farmSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name cannot be empty']
    },
    city: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: 'products'
        }
    ]
})
const farm = mongoose.model('farm', farmSchema);
module.exports = farm;