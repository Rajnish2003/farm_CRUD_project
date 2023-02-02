const mongoose = require("mongoose");
const Product = require('./module/Poduct');
mongoose.set('strictQuery', true);
mongoose.connect("mongodb://localhost:27017/farmStand")
    .then(() => console.log('connect to Mongoose'))
    .catch(() => console.log('connection me error aa raha hai'));

// const p = new Product({
//     name: 'Banana',
//     price: 2,
//     category: 'fruit'
// })

// p.save().then(e => { console.log(e) })
//     .catch((e) => console.log(e));

// Product.insertMany([
//     { name: "Mango", price: 5, category: 'fruit' },
//     { name: "Tomato", price: 2, category: 'vegetable' },
//     { name: "Egg", price: 4, category: 'poultry' },
//     { name: "Paneer", price: 8, category: 'dairy' },
//     { name: "Chicken", price: 6, category: 'other' },

// ]).then(p => console.log(p))
//     .catch(p => console.log(p));