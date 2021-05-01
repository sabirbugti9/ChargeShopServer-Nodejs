const express = require("express");
const router = express.Router();
const multer = require('multer');
const { updateImagesProduct, getProductFeaturedController, getProductCountController, addProductController, getProductsController, getSingleProduct, updateProduct, deleteProductController } = require('../controller/product_controller');

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
};



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isVaild = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invaild image type');
        if (isVaild) {
            uploadError = null;
        }
        cb(uploadError, 'public/uploads')
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];

        cb(null, `${fileName}-${Date.now()}.${extension}`)
    }
})

const uploadOptions = multer({ storage: storage })


router.post('/', uploadOptions.single('image',), addProductController),
router.put('/gallery-image/:id', uploadOptions.any('images'), updateImagesProduct),

    router.get('/:id', getSingleProduct),
    router.put('/:id', updateProduct),
    router.delete('/:id', deleteProductController),
    router.get('/get/featured/:count', getProductFeaturedController),
    router.get('/get/count', getProductCountController),


    router.get('/', getProductsController),


    module.exports = router;


