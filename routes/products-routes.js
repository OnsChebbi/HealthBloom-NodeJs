const express = require('express');
const {check} = require('express-validator');
const fileUpload = require('../middleware/file-upload');


const productsControllers = require('../controllers/products-controller')


const router = express.Router();


router.get('/', productsControllers.getProducts);
router.get('/:pid', productsControllers.getProductById);

// router.get('/user/:uid', placesControllers.getPlacesByUserId);

router.post('/',
    fileUpload.single('image'),
    [
        check('name')
            .not()
            .isEmpty(),
        check('description')
            .isLength({min: 5})
            .notEmpty(),
        check('price','Price must be a number greater than 0.')
            .not()
            .isEmpty()
            .isFloat({ min: 0 }),
        check('quantity','quantity must be a number greater than 0.')
            .notEmpty()
            .isInt({ min: 0 }),
        check('category')
            .not()
            .isEmpty()
    ],
    productsControllers.createProduct);

router.patch('/:pid',
    [
            check('name')
                .not()
                .isEmpty(),
            check('description')
                .isLength({min: 5})
                .notEmpty(),
            check('price','Price must be a number greater than 0.')
                .not()
                .isEmpty()
                .isFloat({ min: 0 }),
            check('quantity','quantity must be a number greater than 0.')
                .notEmpty()
                .isInt({ min: 0 }),
            check('category')
                .not()
                .isEmpty()
    ], productsControllers.updateProductById);

router.delete('/:pid', productsControllers.deleteProductById);


module.exports = router;