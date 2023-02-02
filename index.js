const express = require('express');
const app = express();
const path = require('path');
const mongoose = require("mongoose");
const Product = require('./module/Poduct');
const Farm = require('./module/farm');
const methodOverride = require('method-override');
const { findOneAndUpdate, findByIdAndUpdate } = require('./module/Poduct');
const AppError = require('./AppError');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

mongoose.set('strictQuery', true);
mongoose.connect("mongodb://localhost:27017/farmStand",
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('connect to Mongoose'))
    .catch(() => console.log('connection me error aa raha hai'));

const categories = ['select', 'fruit', 'vegetable', 'poultry', 'dairy', 'other'];

//for FARM

app.get('/farms', async (req, res) => {
    const farms = await Farm.find({});
    res.render('farms/index', { farms });
})

app.get('/farms/:id', async (req, res) => {
    const farm = await Farm.findById(req.params.id);
    console.log(farm);
    res.render('farms/show', { p: farm });
})

app.get('/farm/new', async (req, res) => {
    console.log("/farm/new hu mai");
    res.render('farms/new');
})
app.post('/farm', async (req, res) => {
    const farm = new Farm(req.body);
    await farm.save();
    res.redirect('farms')
})

app.get('/farms/:id/new', async (req, res) => {
    const { id } = req.params;
    res.render('new', { id, categories });
})

app.post('/farms/:id/products', async (req, res) => {
    const { id } = req.params;
    const { name, price, category } = req.body;
    const product = new Product({ name, price, category });
    const farm = await Farm.findById(id);
    console.log(typeof (id));
    res.send(product);
    // console.log(farm);
    // farm.products.push(product);
    // product.farm = farm;
    // await farm.save();
    // await product.save();
    // res.redirect(`/farms/${id}`);
})

//FOR PRODUCTS

app.get('/', wrapAsync(async (req, res) => {
    const { category } = req.query;
    if (category) {
        const p = await Product.find({ 'category': category });
        res.render('index', { p, category });
    }
    else {
        const p = await Product.find({});
        res.render('index', { p, category: 'ALL' });
    }
}))

app.get('/add', wrapAsync((req, res) => {
    const { password } = req.query;
    if (password == '1234') {
        res.render('new', { categories });
    }
    else {
        throw new AppError('Not Allowed for enter use this:=> http://localhost:3000/add?password=1234', 401);
    }
}))

app.post('/', wrapAsync(async (req, res, next) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    console.log(newProduct);
    res.redirect("/");
}))

function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(e => next(e));
    }
}

app.get('/:id', wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
        return next(new AppError('Product not found', 404));
    }
    res.render('show', { p: product });
}))

app.get('/:id/edit', wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('edit', { p: product, categories });
}))

app.put('/:id', wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body);
    res.redirect(`/${product.id}`);
}))

app.delete('/:id', wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const p = await Product.findByIdAndDelete(id);
    res.redirect('/');
}))

const handleErr = err => {
    console.dir(err);
    return new AppError(`Validation Failed... ${err.message}`, 400);
}

app.use((err, req, res, next) => {
    console.log(err.name);
    if (err.name == 'ValidationError') {
        err = handleErr(err);
    }
    next(err);
})
app.use((err, req, res, next) => {
    const { status = 500, message = 'Something is went wrong' } = err;
    res.status(status).send(message);
})


app.listen(3000, () => {
    console.log("Sun raha hai na tu");
})