const express = require('express');
const {check} = require('express-validator');


const couponsControllers = require('../controllers/coupons-controller')


const router = express.Router();




router.get('/', couponsControllers.getCoupons);
router.get('/:cid', couponsControllers.getCouponById);
router.get('/name/:name', couponsControllers.getCouponByName);
router.post('/',
    [
        check('name')
            .not()
            .isEmpty(),
        check('percentage')
            .notEmpty()
            .isInt({ min: 0 , max: 100 }),
    ], couponsControllers.createCoupon);
router.patch('/:cid',
    [
        check('name')
            .not()
            .isEmpty(),
        check('percentage')
            .notEmpty()
            .isInt({ min: 0 , max: 100 }),
    ], couponsControllers.updateCouponById);

router.delete('/:cid', couponsControllers.deleteCouponById);


module.exports = router;