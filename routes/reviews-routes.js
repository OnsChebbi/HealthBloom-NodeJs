const express = require('express');
const {check} = require('express-validator');

const reviewsControllers = require('../controllers/reviews-controller')


const router = express.Router();


router.get('/', reviewsControllers.getReviews);
router.get('/:rid', reviewsControllers.getReviewById);

// router.get('/user/:uid', reviewsControllers.getReviewsByUserId);
router.get('/product/:pid', reviewsControllers.getReviewsByProductId);

router.post('/',
    [
        check('name')
            .not()
            .isEmpty(),
        check('message')
            .isLength({min: 1})
            .notEmpty(),
        check('rating', 'Rating must be a number between 0 and 5')
            .not()
            .isEmpty()
            .isInt({min: 0, max: 5}),
        check('date')
            .not()
            .isEmpty(),
        check('email')
            .isEmail(),
        check('product')
            .not()
            .isEmpty()
    ],
    reviewsControllers.createReview);

router.patch('/:rid',
    [
        check('name')
            .not()
            .isEmpty(),
        check('message')
            .isLength({min: 1})
            .notEmpty(),
        check('rating', 'Rating must be a number between 0 and 5')
            .not()
            .isEmpty()
            .isInt({min: 0, max: 5}),
        check('date')
            .not()
            .isEmpty(),
        check('email')
            .isEmail()
    ], reviewsControllers.updateReviewById);

router.delete('/:pid', reviewsControllers.deleteReviewById);


module.exports = router;