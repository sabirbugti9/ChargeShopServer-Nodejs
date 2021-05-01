

const Category = require('../models/category');
const mongoose = require('mongoose');

exports.addCategoryController =async (req, res, next) => {




    
    const name = req.body.name;
    const icon = req.body.icon;
    const color = req.body.color;
    


    let category = Category({
        name: name,
        color: color,
        icon: icon,

    });
    category = await category.save();

    if (!category)
        return res.status(400).send('the category cannot be created!')

    res.send(category);



};

exports.deleteCategoryController = async (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        res.status(400).send('Invalid Category Id');
    }
    Category.findByIdAndRemove(req.params.id).then(category => {
        if (category) {
            return res.status(200).json({ success: true, message: 'the category is deleted' });
        } else {
            return res.status(404).json({ success: false, message: 'the category no Found' });
        }
    }).catch(err => {
        return res.status(500).json({ success: false, error: err });

    });

};

exports.getCategoryController = async (req, res, next) => {
    const categoryList = await Category.find();
    if (!categoryList) {
        res.status(500).json({
            success: false,
        })
    }
    res.status(200).json(categoryList);
};
exports.updateCategory = async (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        res.status(400).send('Invalid Category Id');
    }
    const category = await Category.findByIdAndUpdate(req.params.id, {
        color: req.body.color,
        name: req.body.name,
        icon: req.body.icon,
    }, {
        new: true,
    });
    if (!category) {
        res.status(400).json({
            message: 'The Category cannot be created!',
        })
    }
    res.send(category);
};
exports.getCategoryCountController = async (req, res, next) => {
    const categoryCount = await Category.countDocuments((count) => count);
    if (!categoryCount) {
        res.status(500).json({
            success: false,
        })
    }
    res.status(201).json({ count: categoryCount });
};
exports.getSingleCategory = async (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        res.status(400).send('Invalid Category Id');
    }
    const CategoryList = await Category.findById(req.params.id);
    if (!CategoryList) {
        res.status(500).json({
            message: 'The Category with the given ID was not found',
        })
    }
    res.status(200).json(CategoryList);
};
