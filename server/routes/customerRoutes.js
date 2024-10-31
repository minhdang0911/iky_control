const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');

router.post('/create', verifyAccessToken, customerController.addCustomer);
router.get('/getCustomer', verifyAccessToken, customerController.getCustomers);
module.exports = router;
