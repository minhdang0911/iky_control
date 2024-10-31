const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');
// Route tạo cửa hàng mới
router.post('/create', verifyAccessToken, storeController.createStore);
router.get('', storeController.getStoresPagination);
router.get('/getallstore', storeController.getStores);
router.put('/update/:id', storeController.updateStore);
router.delete('/delete/:id', storeController.deleteStore);

module.exports = router;
