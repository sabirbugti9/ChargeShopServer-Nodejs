const express = require("express");
const router = express.Router();
const { getCategoryCountController, updateCategory, addCategoryController, getCategoryController, deleteCategoryController, getSingleCategory } = require('../controller/category_controller');

router.post('/', addCategoryController),
    router.get('/', getCategoryController),
    router.get('/:id', getSingleCategory),
    router.get('/get/count', getCategoryCountController),
    
    router.put('/:id', updateCategory),
    router.delete('/:id', deleteCategoryController),



    module.exports = router;


