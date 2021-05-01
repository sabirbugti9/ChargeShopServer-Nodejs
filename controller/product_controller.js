

const Product = require('../models/product');
const Category = require('../models/category');
const mongoose = require('mongoose');

exports.addProductController = async (req, res, next) => {
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send('Invalid Category');
    const file = req.file;
    if (!file) return res.status(400).send('No Image in the request');


    const name = req.body.name;
    const fileName = req.file.filename;
    const countInStock = req.body.countInStock;
    const description = req.body.description;
    const richdescription = req.body.richdescription;
    const images = req.body.images;
    const brand = req.body.brand;
    const price = req.body.price;
    const rating = req.body.rating;
    const numReviews = req.body.numReviews;
    const isFeatured = req.body.isFeatured;
    const dateCreated = req.body.dateCreated;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    let product = Product({
        name: name,
        image: `${basePath}${fileName}`,
        countInStock: countInStock,
        description: description,
        richdescription: richdescription,
        images: images,
        brand: brand,
        price: price,
        category: category,
        rating: rating,
        numReviews: numReviews,
        isFeatured: isFeatured,
        dateCreated: dateCreated,


    });
    product = await product.save();

    if (!product)
        return res.status(500).send('The product cannot be created')

    res.send(product);



};
exports.getProductCountController = async (req, res) => {
    const productCount = await Product.countDocuments((count) => count)

    if (!productCount) {
        res.status(500).json({ success: false })
    }
    res.send({
        productCount: productCount,
    });
};
exports.getProductFeaturedController = async (req, res, next) => {
    const count = req.params.count ? req.params.count : 0;

    const product = await Product.find({ isFeatured: true }).limit(+count);
    if (!product) {
        res.status(500).json({
            success: false,
        })
    }
    res.send({
        productCount: product,
    });
};
exports.updateProduct = async (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        res.status(400).send('Invalid Product Id');
    }
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send('Invalid Category');
    const name = req.body.name;
    const image = req.body.image;
    const countInStock = req.body.countInStock;
    const description = req.body.description;
    const richdescription = req.body.richdescription;
    const images = req.body.images;
    const brand = req.body.brand;
    const price = req.body.price;
    const rating = req.body.rating;
    const numReviews = req.body.numReviews;
    const isFeatured = req.body.isFeatured;
    const dateCreated = req.body.dateCreated;
    const product = await Product.findByIdAndUpdate(req.params.id, {
        name: name,
        image: image,
        countInStock: countInStock,
        description: description,
        richdescription: richdescription,
        images: images,
        brand: brand,
        price: price,
        category: category,
        rating: rating,
        numReviews: numReviews,
        isFeatured: isFeatured,
        dateCreated: dateCreated,
    }, {
        new: true,
    });
    if (!product) {
        res.status(500).json({
            message: 'The Product cannot be created!',
        })
    }
    res.send(product);
};
exports.getSingleProduct = async (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        res.status(400).send('Invalid Product Id');
    }
    const ProductList = await Product.findById(req.params.id).populate('category');
    console.log(ProductList);
    if (!ProductList) {
        res.status(500).json({
            message: 'The Category with the given ID was not found',
        })
    }
    res.status(201).json(ProductList);
};
exports.getProductsController = async (req, res, next) => {
    let filter = {};
    if (req.query.categories) {
        filter = { category: req.query.categories.split(',') }
    }
    const productList = await Product.find(filter).populate('category');
    if (!productList) {
        res.status(500).json({
            success: false,
        })
    }
    res.send(productList);
};
exports.deleteProductController = async (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        res.status(400).send('Invalid Product Id');
    }
    Product.findByIdAndRemove(req.params.id).then(product => {
        if (product) {
            return res.status(201).json({ success: true, message: 'the category is deleted' });
        } else {
            return res.status(404).json({ success: false, message: 'the category no Found' });
        }
    }).catch(err => {
        return res.status(500).json({ success: false, error: err });

    });

};
exports.updateImagesProduct = async (req, res, next) => {

    if (!mongoose.isValidObjectId(req.params.id)) {
        res.status(400).send('Invalid Product Id');
    }
    const files = req.files;

    
    let imagesPaths = [];
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    if (files) {

        files.map(file => {
            console.log(files);
            imagesPaths.push(`${basePath}${file.filename}`);
        });
    }
    const product = await Product.findByIdAndUpdate(req.params.id, {

        images: imagesPaths,

    }, {
        new: true,
    });
    if (!product) {
        res.status(500).json({
            message: 'The Product cannot be created!',
        })
    }
    res.send(product);
};

